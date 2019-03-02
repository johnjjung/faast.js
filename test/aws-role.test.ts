import test from "ava";
import { faast } from "../index";
import * as funcs from "./fixtures/functions";
import * as aws from "aws-sdk";
import { deleteRole } from "../src/aws/aws-faast";
import * as uuidv4 from "uuid/v4";

test("remote aws custom role", async t => {
    t.plan(1);
    const iam = new aws.IAM();
    let uuid = uuidv4();
    const RoleName = `faast-test-custom-role-${uuid}`;
    let cloudFunc;
    let PolicyArn;
    try {
        const AssumeRolePolicyDocument = JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Principal: { Service: "lambda.amazonaws.com" },
                    Action: "sts:AssumeRole",
                    Effect: "Allow"
                }
            ]
        });
        await iam
            .createRole({
                AssumeRolePolicyDocument,
                RoleName,
                Description: "test custom role for lambda functions created by faast"
            })
            .promise();

        const PolicyDocument = JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: ["logs:*"],
                    Resource: "arn:aws:logs:*:*:log-group:faast-*"
                },
                {
                    Effect: "Allow",
                    Action: ["s3:*"],
                    Resource: "arn:aws:s3:::faast-*"
                },
                {
                    Effect: "Allow",
                    Action: ["sqs:*"],
                    Resource: "arn:aws:sqs:*:*:faast-*"
                }
            ]
        });

        const executionPolicy = await iam
            .createPolicy({
                Description: "test faast custom role policy",
                PolicyName: RoleName,
                PolicyDocument
            })
            .promise();

        PolicyArn = executionPolicy.Policy!.Arn!;
        await iam.attachRolePolicy({ RoleName, PolicyArn }).promise();

        cloudFunc = await faast("aws", funcs, "./fixtures/functions", {
            RoleName
        });
        t.is(await cloudFunc.functions.identity("hello"), "hello");
    } finally {
        cloudFunc && (await cloudFunc.cleanup());
        await deleteRole(RoleName, iam);
        PolicyArn && (await iam.deletePolicy({ PolicyArn }).promise());
    }
});