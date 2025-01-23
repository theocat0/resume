class AIService {
  constructor() {
    this.isInitialized = true;
    this.API_TOKEN = process.env.REACT_APP_HUGGINGFACE_API_TOKEN;
    this.API_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-33b-instruct';
    
    this.context = `You are an AI assistant for Théo Pasquier. Here's key information about Théo:
    - Computer Science student at University of New England (2022-2026)
    - Campus Leader at Notion (Oct 2023-Present)
    - Experience with AI testing (ChatGPT .3 beta, GPT-4 red team member)
    - Robotics team experience at UNE
    - Skills: AI Testing, Robotics, Automation
    - Location: Biddeford, Maine`;
  }

  async generateResponse(query) {
    try {
      console.log('Sending request to API...');
      const prompt = `### System: ${this.context}

### Human: ${query}

### Assistant: Let me help you with that.`;
      
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 200,
              temperature: 0.7,
              top_p: 0.95,
              do_sample: true,
              return_full_text: false
            }
          }),
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (response.status === 503) {
          // Model is loading, wait and retry
          const result = JSON.parse(responseText);
          const waitTime = Math.min(result.estimated_time || 20, 20) * 1000;
          console.log(`Model loading, waiting ${waitTime/1000} seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries++;
          continue;
        }

        if (!response.ok) {
          console.error('API error:', responseText);
          return this.getFallbackResponse(query);
        }

        try {
          const result = JSON.parse(responseText);
          console.log('Parsed result:', result);
          
          if (result && result[0] && result[0].generated_text) {
            const generatedText = result[0].generated_text.trim();
            if (generatedText.length > 0) {
              return generatedText;
            }
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
        }
        
        break;
      }
      
      return this.getFallbackResponse(query);
    } catch (error) {
      console.error('Network or other error:', error);
      return this.getFallbackResponse(query);
    }
  }

  getFallbackResponse(query) {
    query = query.toLowerCase();
    
    if (query.includes('education') || query.includes('study') || query.includes('university')) {
      return "I'm studying Computer Science at University of New England (2022-2026) with a Business minor.";
    }
    
    if (query.includes('ai') || query.includes('gpt') || query.includes('artificial intelligence')) {
      return "I've been involved in AI testing, including beta testing ChatGPT .3 and being part of the GPT-4 red team.";
    }
    
    if (query.includes('robot') || query.includes('automation')) {
      return "I work with the UNE Robotics team on automated systems development and testing.";
    }
    
    if (query.includes('notion') || query.includes('work') || query.includes('job')) {
      return "I'm a Campus Leader at Notion since October 2023, where I lead workshops and implement productivity solutions.";
    }
    
    if (query.includes('skill') || query.includes('can') || query.includes('able')) {
      return "My key skills include AI Testing, Robotics, Automation, Project Management, and Leadership.";
    }

    if (query.includes('who') || query.includes('about') || query.includes('yourself')) {
      return "I'm Théo Pasquier, a Computer Science student at UNE with experience in AI testing and robotics. I currently work as a Campus Leader at Notion.";
    }
    
    return "Try asking about my education, AI experience, robotics background, or skills! For example: 'What's your AI experience?' or 'Tell me about your education.'";
  }

  async initialize() {
    return true;
  }
}

const aiService = new AIService();
export default aiService;
