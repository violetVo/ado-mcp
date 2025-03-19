import { WebApi } from 'azure-devops-node-api';
import {
  CommentThreadStatus,
  GitPullRequest,
  GitPullRequestChange,
  GitPullRequestCommentThread,
  GitPullRequestSearchCriteria,
  PullRequestStatus
} from 'azure-devops-node-api/interfaces/GitInterfaces';
import { z } from 'zod';
import { AzureDevOpsResourceNotFoundError } from '../../common/errors';
import * as schemas from './schemas';

/**
 * Convert string status to PullRequestStatus enum
 */
function convertToPullRequestStatus(status: string): PullRequestStatus {
  switch (status) {
    case 'active':
      return PullRequestStatus.Active;
    case 'abandoned':
      return PullRequestStatus.Abandoned;
    case 'completed':
      return PullRequestStatus.Completed;
    case 'all':
      return PullRequestStatus.All;
    default:
      throw new Error(`Invalid pull request status: ${status}`);
  }
}

/**
 * Convert string status to CommentThreadStatus enum
 */
function convertToCommentThreadStatus(status: string): CommentThreadStatus {
  switch (status) {
    case 'active':
      return CommentThreadStatus.Active;
    case 'fixed':
      return CommentThreadStatus.Fixed;
    case 'wontfix':
      return CommentThreadStatus.WontFix;
    case 'closed':
      return CommentThreadStatus.Closed;
    case 'pending':
      return CommentThreadStatus.Pending;
    default:
      throw new Error(`Invalid thread status: ${status}`);
  }
}

/**
 * Get a specific pull request
 */
export async function getPullRequest(
  connection: WebApi,
  args: z.infer<typeof schemas.GetPullRequestSchema>
): Promise<GitPullRequest> {
  try {
    const gitApi = await connection.getGitApi();
    const pullRequest = await gitApi.getPullRequest(
      args.repositoryId,
      args.pullRequestId,
      args.projectId
    );

    if (!pullRequest) {
      throw new AzureDevOpsResourceNotFoundError(
        `Pull request ${args.pullRequestId} not found in repository ${args.repositoryId}`
      );
    }

    return pullRequest;
  } catch (error) {
    if (error instanceof AzureDevOpsResourceNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to get pull request: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * List pull requests in a repository
 */
export async function listPullRequests(
  connection: WebApi,
  args: z.infer<typeof schemas.ListPullRequestsSchema>
): Promise<GitPullRequest[]> {
  try {
    const gitApi = await connection.getGitApi();
    const searchCriteria: GitPullRequestSearchCriteria = {
      status: args.status ? convertToPullRequestStatus(args.status) : undefined,
      creatorId: args.creatorId,
      reviewerId: args.reviewerId,
      sourceRefName: args.sourceRefName,
      targetRefName: args.targetRefName,
      includeLinks: args.includeLinks
    };

    const pullRequests = await gitApi.getPullRequests(
      args.repositoryId,
      searchCriteria,
      args.projectId
    );

    return pullRequests;
  } catch (error) {
    throw new Error(`Failed to list pull requests: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * List comments in a pull request
 */
export async function listPRComments(
  connection: WebApi,
  args: z.infer<typeof schemas.ListPRCommentsSchema>
): Promise<GitPullRequestCommentThread[]> {
  try {
    const gitApi = await connection.getGitApi();
    const threads = await gitApi.getThreads(
      args.repositoryId,
      args.pullRequestId,
      args.projectId
    );

    return threads;
  } catch (error) {
    throw new Error(`Failed to list PR comments: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update a pull request comment
 */
export async function updatePRComment(
  connection: WebApi,
  args: z.infer<typeof schemas.UpdatePRCommentSchema>
): Promise<GitPullRequestCommentThread> {
  try {
    const gitApi = await connection.getGitApi();
    const comment = { content: args.content };
    
    const updatedThread = await gitApi.updateComment(
      comment,
      args.repositoryId,
      args.pullRequestId,
      args.threadId,
      args.commentId,
      args.projectId
    );

    if (!updatedThread) {
      throw new AzureDevOpsResourceNotFoundError(
        `Comment ${args.commentId} not found in thread ${args.threadId}`
      );
    }

    return updatedThread;
  } catch (error) {
    if (error instanceof AzureDevOpsResourceNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to update PR comment: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update a pull request thread status
 */
export async function updatePRThreadStatus(
  connection: WebApi,
  args: z.infer<typeof schemas.UpdatePRThreadStatusSchema>
): Promise<GitPullRequestCommentThread> {
  try {
    const gitApi = await connection.getGitApi();
    const thread = { status: convertToCommentThreadStatus(args.status) };
    
    const updatedThread = await gitApi.updateThread(
      thread,
      args.repositoryId,
      args.pullRequestId,
      args.threadId,
      args.projectId
    );

    if (!updatedThread) {
      throw new AzureDevOpsResourceNotFoundError(
        `Thread ${args.threadId} not found in pull request ${args.pullRequestId}`
      );
    }

    return updatedThread;
  } catch (error) {
    if (error instanceof AzureDevOpsResourceNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to update thread status: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Create a new pull request comment
 */
export async function createPRComment(
  connection: WebApi,
  args: z.infer<typeof schemas.CreatePRCommentSchema>
): Promise<GitPullRequestCommentThread> {
  try {
    const gitApi = await connection.getGitApi();
    
    const comment: { content: string; parentCommentId?: number } = {
      content: args.content
    };

    if (args.parentCommentId !== undefined) {
      comment.parentCommentId = args.parentCommentId;
    }

    const thread = {
      comments: [comment],
      threadContext: args.filePath && typeof args.lineNumber === 'number' ? {
        filePath: args.filePath,
        rightFileStart: { line: args.lineNumber, offset: 1 },
        rightFileEnd: { line: args.lineNumber, offset: 1 }
      } : args.filePath ? {
        filePath: args.filePath,
        rightFileStart: { line: 1, offset: 1 },
        rightFileEnd: { line: 1, offset: 1 }
      } : undefined
    };

    const newThread = await gitApi.createThread(
      thread,
      args.repositoryId,
      args.pullRequestId,
      args.projectId
    );

    if (!newThread) {
      throw new Error('Failed to create comment thread');
    }

    return newThread;
  } catch (error) {
    throw new Error(`Failed to create PR comment: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get files changed in a pull request
 */
export async function getPRFiles(
  connection: WebApi,
  args: z.infer<typeof schemas.GetPRFilesSchema>
): Promise<GitPullRequestChange[]> {
  try {
    const gitApi = await connection.getGitApi();
    const iterations = await gitApi.getPullRequestIterations(
      args.repositoryId,
      args.pullRequestId,
      args.projectId
    );
    
    if (!iterations.length) {
      return [];
    }

    const latestIteration = iterations[iterations.length - 1];
    if (!latestIteration.id) {
      throw new Error('Latest iteration ID is missing');
    }

    const changes = await gitApi.getPullRequestIterationChanges(
      args.repositoryId,
      args.pullRequestId,
      latestIteration.id,
      args.projectId,
      undefined, // top
      undefined, // skip
      args.compareTo ? parseInt(args.compareTo) : undefined
    );

    if (!changes.changeEntries) {
      return [];
    }

    return changes.changeEntries;
  } catch (error) {
    throw new Error(`Failed to get PR files: ${error instanceof Error ? error.message : String(error)}`);
  }
}
