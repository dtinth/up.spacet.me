// Declare the Language Model API types
declare global {
  interface Window {
    LanguageModel?: {
      create(options: {
        initialPrompts: Array<{
          role: string;
          content: string;
        }>;
        expectedInputs: Array<{ type: string }>;
      }): Promise<{
        prompt(messages: Array<{
          role: string;
          content: Array<{
            type: string;
            value: string | Blob;
          }>;
        }>): Promise<string>;
      }>;
    };
  }
}

export async function generateAltText(blob: Blob): Promise<string> {
  // Check if the API is available
  if (!window.LanguageModel) {
    throw new Error('Language Model API is not available');
  }

  try {
    const session = await window.LanguageModel.create({
      initialPrompts: [
        {
          role: 'system',
          content:
            'You are an accessibility specialist who writes alt text for images. Write concise, descriptive alt text that conveys the image content clearly.',
        },
      ],
      expectedInputs: [{ type: 'image' }],
    });

    const result = await session.prompt([
      {
        role: 'user',
        content: [
          {
            type: 'text',
            value: `Generate a clear, descriptive alt text for this image. The alt text should be concise but detailed enough to convey the image content to someone who cannot see it.`,
          },
          { type: 'image', value: blob },
        ],
      },
    ]);

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate alt text: ${error.message}`);
    }
    throw new Error('Failed to generate alt text: Unknown error');
  }
}
