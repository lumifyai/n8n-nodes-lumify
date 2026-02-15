import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class Lumify implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Lumify',
    name: 'lumify',
    icon: 'file:lumify.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'AI-powered search and research APIs from Lumify',
    defaults: {
      name: 'Lumify',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'lumifyApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://lumify.ai/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    properties: [
      // ----------------------------------
      //         Operation Selection
      // ----------------------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Search',
            value: 'search',
            description: 'Search your indexed website content and get AI-generated answers',
            action: 'Search your indexed content',
          },
          {
            name: 'Last 30 Days',
            value: 'last30days',
            description: 'Research trends and discussions from social media and web sources',
            action: 'Research trends from the last 30 days',
          },
        ],
        default: 'search',
      },

      // ----------------------------------
      //         Search Operation
      // ----------------------------------
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
        description: 'The search query or natural language question',
        placeholder: 'e.g., How do I reset my password?',
      },
      {
        displayName: 'Options',
        name: 'searchOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
        options: [
          {
            displayName: 'Answer Mode',
            name: 'answer_mode',
            type: 'boolean',
            default: true,
            description: 'Whether to cache high-confidence answers for faster future responses',
          },
          {
            displayName: 'Similar Questions',
            name: 'similar_questions',
            type: 'boolean',
            default: false,
            description: 'Whether to return similar questions from your knowledge base',
          },
        ],
      },

      // ----------------------------------
      //         Last30Days Operation
      // ----------------------------------
      {
        displayName: 'Topic',
        name: 'topic',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['last30days'],
          },
        },
        description: 'The topic to research (max 200 characters)',
        placeholder: 'e.g., React Server Components',
      },
      {
        displayName: 'Options',
        name: 'last30daysOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            operation: ['last30days'],
          },
        },
        options: [
          {
            displayName: 'Sources',
            name: 'sources',
            type: 'multiOptions',
            options: [
              {
                name: 'Reddit',
                value: 'reddit',
              },
              {
                name: 'Twitter/X',
                value: 'twitter',
              },
              {
                name: 'Web',
                value: 'web',
              },
            ],
            default: ['twitter', 'reddit', 'web'],
            description: 'Data sources to query for research',
          },
          {
            displayName: 'Days',
            name: 'days',
            type: 'number',
            typeOptions: {
              minValue: 1,
              maxValue: 30,
            },
            default: 30,
            description: 'Number of days to look back (1-30)',
          },
          {
            displayName: 'Max Results',
            name: 'max_results',
            type: 'number',
            typeOptions: {
              minValue: 5,
              maxValue: 50,
            },
            default: 20,
            description: 'Maximum evidence items per source (5-50)',
          },
          {
            displayName: 'Output Format',
            name: 'output_format',
            type: 'options',
            options: [
              {
                name: 'Summary',
                value: 'summary',
                description: 'Markdown-formatted narrative',
              },
              {
                name: 'Bullets',
                value: 'bullets',
                description: 'Structured bullet points',
              },
              {
                name: 'JSON',
                value: 'json',
                description: 'Fully structured data',
              },
            ],
            default: 'summary',
            description: 'Response format for the research brief',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('lumifyApi');

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject;

        if (operation === 'search') {
          // Validate that appId is provided for Search operation
          if (!credentials.appId) {
            throw new NodeOperationError(
              this.getNode(),
              'Application ID is required for the Search operation. Please add it to your Lumify credentials.',
              { itemIndex: i },
            );
          }

          const query = this.getNodeParameter('query', i) as string;
          const searchOptions = this.getNodeParameter('searchOptions', i, {}) as IDataObject;

          const body: IDataObject = {
            query,
            application_id: credentials.appId,
          };

          if (searchOptions.answer_mode !== undefined) {
            body.answer_mode = searchOptions.answer_mode;
          }
          if (searchOptions.similar_questions !== undefined) {
            body.similar_questions = searchOptions.similar_questions;
          }

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'lumifyApi',
            {
              method: 'POST',
              url: 'https://www.lumify.ai/api/v1/search.php',
              body,
              json: true,
            },
          );

          responseData = response as IDataObject;
        } else if (operation === 'last30days') {
          const topic = this.getNodeParameter('topic', i) as string;
          const options = this.getNodeParameter('last30daysOptions', i, {}) as IDataObject;

          const body: IDataObject = {
            topic,
          };

          if (options.sources !== undefined) {
            body.sources = options.sources;
          }
          if (options.days !== undefined) {
            body.days = options.days;
          }
          if (options.max_results !== undefined) {
            body.max_results = options.max_results;
          }
          if (options.output_format !== undefined) {
            body.output_format = options.output_format;
          }

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'lumifyApi',
            {
              method: 'POST',
              url: 'https://www.lumify.ai/api/v1/skills/last30days',
              body,
              json: true,
            },
          );

          responseData = response as IDataObject;
        } else {
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
            itemIndex: i,
          });
        }

        returnData.push({
          json: responseData,
          pairedItem: { item: i },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
