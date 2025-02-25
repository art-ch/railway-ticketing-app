import * as cdk from 'aws-cdk-lib';
import { RailwayTicketingStack } from './railway-ticketing-stack';

const app = new cdk.App();
new RailwayTicketingStack(app, 'RailwayTicketingStack');
