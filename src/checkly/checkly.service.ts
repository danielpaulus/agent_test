import { Injectable } from '@nestjs/common';
import { AlertDto } from './alertDTO';
import { ChecklyClient } from './checklyclient';
import { ChecklyAgent } from './agent';
import { ChecklyAlertSummary } from './checklyAlertEventDTO';
import { v4 as uuidv4 } from 'uuid';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';

export class ChecklyService {
  private readonly checklyClient: ChecklyClient = new ChecklyClient();
  private readonly checklyAgent: ChecklyAgent = new ChecklyAgent();
  processing: boolean = false;
  constructor(@InjectConnection() private readonly knex: Knex) {
    this.checklyAgent.init();
  }

  async alertReceived(data: AlertDto): Promise<string> {
    console.log(
      'alert received:' + data.ALERT_TITLE + ' proc:' + this.processing,
    );
    if (data.ALERT_TYPE !== 'ALERT_FAILURE') {
      console.log('not acting on:' + data.ALERT_TYPE);
      return 'OK';
    }

    if (this.processing) {
      return 'OK';
    }
    this.processing = true;

    //console.log(data);
    const agentResponse = await this.checklyAgent.queryAgent(
      data.CHECK_ID,
      data.CHECK_RESULT_ID,
    );
    const alertSummary: ChecklyAlertSummary = {
      alertTitle: data.ALERT_TITLE,
      alertType: data.ALERT_TYPE,
      checkId: data.CHECK_ID,
      checkResultId: data.CHECK_RESULT_ID,
      checkName: data.CHECK_NAME,
      checkType: data.CHECK_TYPE,
      groupName: data.GROUP_NAME,
      runLocation: data.RUN_LOCATION,
      apiCheckResponseStatusCode: data.API_CHECK_RESPONSE_STATUS_CODE,
      apiCheckResponseStatusText: data.API_CHECK_RESPONSE_STATUS_TEXT,
      aiSummary: agentResponse.answer,
    };
    console.log(`Alert Summary: ${JSON.stringify(alertSummary)}`);
    await this.knex('checkly_alerts').insert({
      id: uuidv4(),
      value: alertSummary,
    });
    this.processing = false;
    return 'OK';
  }

  /*
  async downloadInfo(data: AlertDto): Promise<void> {
    //const content = this.downloadFileAsString(data.RESULT_LINK);
    const checkResult = await this.checklyClient.getCheckResult(
      data.CHECK_ID,
      data.CHECK_RESULT_ID,
    );
    const check = await this.checklyClient.getCheck(data.CHECK_ID);
  }*/

  /*async downloadFileAsString(url): Promise<string> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch file from ${url}: ${response.statusText}`,
        );
      }

      // Get the response body as a string
      const data = await response.text();

      console.log('Downloaded content:', data);
      return data;
    } catch (error) {
      console.error(`Error downloading file: ${error.message}`);
    }
  }
*/
}
