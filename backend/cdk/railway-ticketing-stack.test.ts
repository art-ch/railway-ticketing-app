import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { RailwayTicketingStack } from './railway-ticketing-stack';

describe('RailwayTicketingStack', () => {
  const app = new App();
  const stack = new RailwayTicketingStack(app, 'TestRailwayTicketingStack');
  const template = Template.fromStack(stack);

  test('Stack snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});
