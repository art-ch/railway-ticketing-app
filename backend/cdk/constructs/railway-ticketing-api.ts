import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class RailwayTicketingApiConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // DynamoDB Tables
    const trainsTable = new dynamodb.Table(this, 'TrainsTable', {
      tableName: 'TrainsTable',
      partitionKey: { name: 'trainId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const bookingsTable = new dynamodb.Table(this, 'BookingsTable', {
      tableName: 'BookingsTable',
      partitionKey: { name: 'bookingId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Lambda Functions
    const getTrainFunction = new NodejsFunction(this, 'GetTrain', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../src/functions/trains/getTrain.ts'),
      handler: 'handler',
      environment: {
        TRAINS_TABLE: trainsTable.tableName
      }
    });

    const listTrainsFunction = new NodejsFunction(this, 'ListTrains', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../src/functions/trains/listTrains.ts'),
      handler: 'handler',
      environment: {
        TRAINS_TABLE: trainsTable.tableName
      }
    });

    const createBookingFunction = new NodejsFunction(this, 'CreateBooking', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(
        __dirname,
        '../../src/functions/bookings/createBooking.ts'
      ),
      handler: 'handler',
      environment: {
        BOOKINGS_TABLE: bookingsTable.tableName
      }
    });

    const getBookingFunction = new NodejsFunction(this, 'GetBooking', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../../src/functions/bookings/getBooking.ts'),
      handler: 'handler',
      environment: {
        BOOKINGS_TABLE: bookingsTable.tableName
      }
    });

    const updateBookingStatusFunction = new NodejsFunction(
      this,
      'UpdateBookingStatus',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(
          __dirname,
          '../../src/functions/bookings/updateBookingStatus.ts'
        ),
        handler: 'handler',
        environment: {
          BOOKINGS_TABLE: bookingsTable.tableName
        }
      }
    );

    // Permissions
    trainsTable.grantReadData(getTrainFunction);

    trainsTable.grantReadData(listTrainsFunction);

    bookingsTable.grantWriteData(createBookingFunction);
    trainsTable.grantReadWriteData(createBookingFunction);

    bookingsTable.grantReadData(getBookingFunction);

    bookingsTable.grantReadWriteData(updateBookingStatusFunction);
    trainsTable.grantReadWriteData(updateBookingStatusFunction);

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

    const booking = bookings.addResource('{bookingId}');
    booking.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getBookingFunction)
    );
    booking.addMethod(
      'PATCH',
      new apigateway.LambdaIntegration(updateBookingStatusFunction)
    );
  }
}
