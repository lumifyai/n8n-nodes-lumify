import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class LumifyApi implements ICredentialType {
  name = 'lumifyApi';
  displayName = 'Lumify API';
  documentationUrl = 'https://docs.lumify.ai';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Lumify API key (format: lmfy-xxxxx). Get it from your <a href="https://www.lumify.ai/app/api-keys" target="_blank">Lumify Dashboard</a>.',
    },
    {
      displayName: 'Application ID',
      name: 'appId',
      type: 'string',
      default: '',
      required: false,
      description: 'Your Application ID (required for Search operation). Find it in your <a href="https://www.lumify.ai/app/" target="_blank">Lumify Dashboard</a>.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      url: 'https://lumify.ai/api/v1/skills/last30days',
      method: 'POST',
      json: true,
      body: {
        topic: 'test',
        days: 1,
        max_results: 5,
      },
    },
  };
}
