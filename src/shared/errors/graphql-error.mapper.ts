import { GraphQLFormattedError } from 'graphql';
import { AppError } from './app-error';

type GraphqlErrorWithOriginal = GraphQLFormattedError & {
  originalError?: unknown;
  extensions?: GraphQLFormattedError['extensions'] & {
    originalError?: unknown;
  };
};

function getOriginalError(error: GraphqlErrorWithOriginal): unknown {
  return error.originalError ?? error.extensions?.originalError;
}

export function mapGraphqlError(error: GraphqlErrorWithOriginal): GraphQLFormattedError {
  const originalError = getOriginalError(error);

  if (originalError instanceof AppError) {
    return {
      message: originalError.message,
      extensions: {
        code: originalError.code,
      },
    };
  }

  return {
    message: error.message,
    extensions: {
      code: error.extensions?.code ?? 'INTERNAL_ERROR',
    },
  };
}
