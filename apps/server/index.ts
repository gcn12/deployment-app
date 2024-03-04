import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { EC2 } from "@aws-sdk/client-ec2";
import { SSM } from "@aws-sdk/client-ssm";
import { Route53 } from "@aws-sdk/client-route-53";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const ssm = new SSM({ region: "us-east-1" });
const ec2 = new EC2({ region: "us-east-1" });
const route53 = new Route53({ region: "us-east-1" });

const userSSEConnections = new Map();

app.get("/events", (req, res) => {
  const { userID } = req.query;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  userSSEConnections.set(userID, res);

  req.on("close", () => {
    userSSEConnections.delete(userID);
  });
});

const sendSSE = (message: string, data: null | string, userID: string) => {
  userSSEConnections
    .get(String(userID))
    .write(`data: ${JSON.stringify({ message, data })}\n\n`);
};

const generateEC2Instance = async () => {
  const data = await ec2.runInstances({
    MaxCount: 1,
    MinCount: 1,
    ImageId: "ami-0440d3b780d96b29d",
    InstanceType: "t2.micro",
    IamInstanceProfile: {
      Arn: "arn:aws:iam::808841774714:instance-profile/Full-Access",
    },
    SecurityGroups: ["Deployment-App"], // Inbound: Custom TCP Port 3002 Allow All, SSH TCP Port 22 Allow All. Outbound: All traffic
  });
  return data;
};

const createSubdomain = () => {
  let result = "";

  for (let i = 0; i < 6; i++) {
    result += String.fromCharCode(
      Math.floor(Math.random() * (122 - 97 + 1) + 97)
    );
  }
  return result;
};

const updateDNSRecord = (ec2IPAddress: string) => {
  const url = `${createSubdomain()}.app-deploy.com`;

  route53.changeResourceRecordSets({
    HostedZoneId: "Z06304079TDZZTJHYANC",
    ChangeBatch: {
      Changes: [
        {
          Action: "CREATE",
          ResourceRecordSet: {
            Name: url,
            Type: "A",
            TTL: 300,
            ResourceRecords: [
              {
                Value: ec2IPAddress,
              },
            ],
          },
        },
      ],
    },
  });

  return `http://${url}:3002`;
};

const startServer = async (
  instanceID: string,
  repo: string,
  userID: string
) => {
  return new Promise((resolve, reject) => {
    const intervalID = setInterval(async () => {
      console.log("waiting for ec2");
      const status = await ec2.describeInstanceStatus({
        InstanceIds: [instanceID],
      });
      if (
        status.InstanceStatuses?.[0]?.InstanceState?.Name !== "running" ||
        status.InstanceStatuses?.[0]?.InstanceStatus?.Status === "initializing"
      ) {
        return;
      }
      sendSSE("starting-server", null, userID);
      clearInterval(intervalID);
      const commands = [
        "sudo yum update -y",
        "sudo yum install -y nodejs npm",
        "sudo yum install git -y",
        "cd /home/ec2-user",
        "sudo npm install pm2 -g",
        `git clone ${repo}`,
        "cd basic-express",
        "pm2 start node index.js",
      ];
      try {
        await ssm.sendCommand({
          DocumentName: "AWS-RunShellScript",
          InstanceIds: [instanceID],
          Parameters: {
            commands: commands,
          },
        });
      } catch (err) {
        reject("could not start server");
      }
      resolve("");
    }, 15000);
  });
};

app.post("/generate", async (req: Request, res: Response) => {
  try {
    const { repo, userID } = req.body;

    sendSSE("creating-ec2", null, userID);

    const ec2Data = await generateEC2Instance();
    const instanceID = ec2Data.Instances?.[0].InstanceId;
    if (instanceID) {
      await startServer(instanceID, repo, userID);
      const instanceData = await ec2.describeInstances({
        InstanceIds: [instanceID],
      });
      const publicIPAddress =
        instanceData?.Reservations?.[0]?.Instances?.[0]?.PublicIpAddress;
      if (publicIPAddress) {
        const newURL = updateDNSRecord(publicIPAddress);
        const url = newURL;
        const interval = setInterval(async () => {
          try {
            const res = await fetch(url);
            if (res.ok) {
              clearInterval(interval);
              sendSSE("completed", url, userID);
              console.log(`url: ${url}`);
            }
          } catch (err) {
            console.log(err);
          }
        }, 10000);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
