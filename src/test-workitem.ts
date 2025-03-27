import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';
import { getWorkItem } from './operations/workitems';

async function main() {
    const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;
    if (!token) {
        throw new Error('AZURE_PERSONAL_ACCESS_TOKEN environment variable is required');
    }

    const orgUrl = 'https://dev.azure.com/msazure';
    const authHandler = getPersonalAccessTokenHandler(token);
    const connection = new WebApi(orgUrl, authHandler);

    try {
        const workItem = await getWorkItem(connection, 32010734);
        if (!workItem.fields) {
            throw new Error('No fields found in work item');
        }

        console.log('=== Work Item Details ===');
        console.log(`Title: ${workItem.fields['System.Title']}\n`);
            
        console.log('=== Repro Steps ===');
        const reproSteps = workItem.fields['Microsoft.VSTS.TCM.ReproSteps'] || 'No repro steps available';
        // Basic HTML cleaning and formatting for console output
        const cleanedReproSteps = reproSteps
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/<br>/g, '\n')
            .replace(/<\/li>/g, '\n')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/\n\s*\n/g, '\n\n')
            .split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line)
            .join('\n');
        console.log(cleanedReproSteps.split('\n').map((line: string) => `  ${line}`).join('\n'), '\n');
            
        console.log('=== Comments History ===');
        const history = workItem.fields['System.History'] || 'No comments available';
        console.log(history);
    } catch (error) {
        console.error('Error:', error);
    }
}

main().catch(console.error);
