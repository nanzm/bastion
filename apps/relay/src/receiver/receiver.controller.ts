import { Controller, Get, Ip, Logger, Post, Req } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { SentryService } from './sentry.service';
import { dumpJson } from 'libs/shared/utils';

@Controller()
export class ReceiverController {
  private readonly logger = new Logger(ReceiverController.name);

  constructor(
    private readonly reportService: ReceiverService,
    private readonly sentryService: SentryService,
  ) {}

  @Post('/report')
  async report(): Promise<string> {
    // await this.eventService.handleEvent(req.body, ip);
    return 'ok';
  }

  @Post('/api/:id/store')
  async sentryStore(@Ip() ip: string, @Req() req: any): Promise<string> {
    try {
      // query
      const { sentry_key, sentry_version } = req.query;

      // body
      const body = JSON.parse(req.body);

      const storeData = {
        sentry_key,
        sentry_version,
        ip,
        ...body,
      };

      //debug
      await dumpJson('sentryStore', storeData);

      this.logger.log('relay sentryStore....');

      await this.sentryService.storeDataAdapter(storeData);
      return 'ok';
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }

  @Post('/api/:id/envelope')
  async sentryEnvelope(@Ip() ip: string, @Req() req: any): Promise<string> {
    try {
      // query
      const { sentry_key, sentry_version } = req.query;

      // body
      const textBody = req.body;
      const result = {};
      if (textBody) {
        const allJson = textBody.split('\n');
        for (const jsonStr of allJson) {
          const json = JSON.parse(jsonStr);
          Object.assign(result, json);
        }
      }

      const envelopeData = {
        sentry_key,
        sentry_version,
        ip,
        ...result,
      };

      //debug
      await dumpJson('sentryEnvelope', envelopeData);

      this.logger.log('relay sentryEnvelope....');

      await this.sentryService.envelopeDataAdapter(envelopeData);
      return 'ok';
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }
}
