import OpenAI from 'openai';

// Initialize OpenAI client
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI API configured');
} else {
  console.warn('⚠️  OpenAI API key not configured - using mock AI responses');
}

export interface AIInsights {
  keyTakeaways: string[];
  actionSteps: string[];
}

/**
 * Generate AI-powered insights from a mentor's answer
 * Returns key takeaways and actionable next steps for the mentee
 */
export async function generateAIInsights(
  question: string,
  answer: string
): Promise<AIInsights | null> {
  // If no API key, return mock data
  if (!openai) {
    return getMockInsights();
  }

  try {
    const prompt = `You are an expert mentor coach analyzing a mentorship interaction.

Question from mentee: "${question}"

Mentor's answer: "${answer}"

Based on this mentorship interaction, provide:
1. 3-4 key takeaways that capture the most important insights from the mentor's answer
2. 3-5 specific, actionable steps the mentee should take next

Format your response as JSON with this structure:
{
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "actionSteps": ["action 1", "action 2", "action 3", "action 4", "action 5"]
}

Make the takeaways insightful and the action steps specific, measurable, and realistic.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cost-effective
      messages: [
        {
          role: 'system',
          content: 'You are an expert mentor coach who helps mentees extract maximum value from mentorship. You provide clear, actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const insights: AIInsights = JSON.parse(content);

    // Validate the response structure
    if (!insights.keyTakeaways || !insights.actionSteps) {
      throw new Error('Invalid response format from OpenAI');
    }

    return insights;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    // Fall back to mock data on error
    return getMockInsights();
  }
}

/**
 * Get mock insights when OpenAI is not available
 */
function getMockInsights(): AIInsights {
  return {
    keyTakeaways: [
      "Focus on building skills through consistent practice",
      "Leverage your unique perspective as a competitive advantage",
      "Build relationships with people who have walked similar paths"
    ],
    actionSteps: [
      "Schedule 30 minutes this week to practice your pitch",
      "Research 3-5 role models in your target industry",
      "Reach out to 2 professionals for informational interviews",
      "Document your progress and reflect weekly",
      "Join a relevant professional community or group"
    ]
  };
}

/**
 * Generate a personalized welcome message for a new mentee
 */
export async function generateWelcomeMessage(
  menteeName: string,
  interests: string[]
): Promise<string> {
  if (!openai) {
    return `Welcome to MicroMentor, ${menteeName}! We're excited to help you grow in ${interests.join(', ')}.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a warm, encouraging mentor coordinator welcoming new mentees. Keep messages brief (2-3 sentences) and motivating.'
        },
        {
          role: 'user',
          content: `Write a welcoming message for ${menteeName} who is interested in: ${interests.join(', ')}`
        }
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || `Welcome ${menteeName}!`;
  } catch (error) {
    console.error('Error generating welcome message:', error);
    return `Welcome to MicroMentor, ${menteeName}!`;
  }
}
