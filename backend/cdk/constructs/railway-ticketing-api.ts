import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class RailwayTicketingApiConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // DynamoDB tables
    const trainsTable = new dynamodb.Table(this, 'TrainsTable', {
      partitionKey: { name: 'trainId', type: dynamodb.AttributeType.STRING }
    });

    const bookingsTable = new dynamodb.Table(this, 'BookingsTable', {
      partitionKey: { name: 'bookingId', type: dynamodb.AttributeType.STRING }
    });

    // Lambda functions
    const getTrainFunction = new lambda.Function(this, 'GetTrainFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'functions/trains.getTrainHandler', // connects to our handler
      code: lambda.Code.fromAsset('src')
    });

    const listTrainsFunction = new lambda.Function(this, 'ListTrainsFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'functions/trains.listTrainsHandler',
      code: lambda.Code.fromAsset('src')
    });

    const createBookingFunction = new lambda.Function(
      this,
      'CreateBookingFunction',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'functions/bookings.createBookingHandler',
        code: lambda.Code.fromAsset('src')
      }
    );

    // Permissions
    trainsTable.grantReadData(getTrainFunction);
    trainsTable.grantReadData(listTrainsFunction);
    bookingsTable.grantWriteData(createBookingFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'RailwayApi');

    // Train endpoints
    const trains = api.root.addResource('trains');
    trains.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listTrainsFunction)
    );

    const train = trains.addResource('{trainId}');
    train.addMethod('GET', new apigateway.LambdaIntegration(getTrainFunction));

    // Booking endpoints
    const bookings = api.root.addResource('bookings');
    bookings.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createBookingFunction)
    );
  }
}
