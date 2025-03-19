import { z } from 'zod';

// Base schema for common pull request fields
const BasePRSchema = z.object({
  projectId: z.string().describe("The ID or name of the project"),
  repositoryId: z.string().describe("The ID or name of the repository"),
  pullRequestId: z.number().describe("The ID of the pull request")
});

// Schema for getting a pull request
export const GetPullRequestSchema = BasePRSchema;

// Schema for listing pull requests
export const ListPullRequestsSchema = z.object({
  projectId: z.string().describe("The ID or name of the project"),
  repositoryId: z.string().describe("The ID or name of the repository"),
  status: z.enum(['active', 'abandoned', 'completed', 'all'])
    .optional()
    .describe("Filter PRs by status"),
  creatorId: z.string().optional().describe("Filter by PR creator"),
  reviewerId: z.string().optional().describe("Filter by reviewer"),
  sourceRefName: z.string().optional().describe("Source branch name"),
  targetRefName: z.string().optional().describe("Target branch name"),
  includeLinks: z.boolean().optional().describe("Include reference links")
});

// Schema for listing PR comments
export const ListPRCommentsSchema = BasePRSchema.extend({
  includeDeleted: z.boolean().optional().describe("Include deleted comments")
});

// Schema for updating PR comment
export const UpdatePRCommentSchema = BasePRSchema.extend({
  threadId: z.number().describe("The thread ID containing the comment"),
  commentId: z.number().describe("The ID of the comment to update"),
  content: z.string().describe("The new comment content")
});

// Schema for updating PR thread status
export const UpdatePRThreadStatusSchema = BasePRSchema.extend({
  threadId: z.number().describe("The thread ID to update"),
  status: z.enum(['active', 'fixed', 'wontfix', 'closed', 'pending'])
    .describe("The new thread status")
});

// Schema for creating PR comment
export const CreatePRCommentSchema = BasePRSchema.extend({
  content: z.string().describe("The comment content"),
  parentCommentId: z.number().optional().describe("Parent comment ID for replies"),
  filePath: z.string().optional().describe("File path for file-specific comments"),
  lineNumber: z.number().optional().describe("Line number for file comments")
});

// Schema for getting PR files
export const GetPRFilesSchema = BasePRSchema.extend({
  compareTo: z.string().optional().describe("Compare changes to specific commit")
});
