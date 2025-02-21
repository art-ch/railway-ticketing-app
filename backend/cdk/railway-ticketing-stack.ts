import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RailwayTicketingApiConstruct } from './constructs/railway-ticketing-api';

export class RailwayTicketingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new RailwayTicketingApiConstruct(this, 'RailwayApi');
  }
}
