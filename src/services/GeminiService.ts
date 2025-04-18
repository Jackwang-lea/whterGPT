import axios from 'axios';

/**
 * Gemini API服务
 * 封装了与Google Gemini API交互的方法
 */
class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    // 从环境变量获取配置
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.apiUrl = import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models';
    this.model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-pro';

    if (!this.apiKey) {
      console.error('Gemini API密钥未配置。请在.env文件中设置VITE_GEMINI_API_KEY。');
    }
  }

  /**
   * 使用Gemini生成文本
   * @param prompt 提示词
   * @param temperature 温度参数 (0.0-1.0)
   * @param maxTokens 最大输出词元数
   * @returns 生成的文本
   */
  async generateText(prompt: string, temperature: number = 0.7, maxTokens: number = 1024): Promise<string> {
    try {
      const url = `${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`;
      
      const response = await axios.post(url, {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.9,
          topK: 40
        }
      });

      // 提取生成的文本
      const generatedText = response.data.candidates[0]?.content?.parts[0]?.text || '';
      return generatedText;
    } catch (error) {
      console.error('调用Gemini API时出错:', error);
      throw new Error('生成文本失败，请稍后重试');
    }
  }

  /**
   * 基于RAG从知识库中查询并生成回复
   * @param query 用户查询
   * @param documents 相关文档数组
   * @returns 生成的回复
   */
  async generateRagResponse(query: string, documents: string[]): Promise<string> {
    try {
      // 构建包含知识库文档的提示词
      const context = documents.join('\n\n');
      const ragPrompt = `我将给你一个问题和一些相关文档内容作为背景信息。
请基于这些信息回答问题，如果无法从提供的信息中找到答案，请明确说明。

背景信息:
${context}

问题:
${query}`;

      // 调用Gemini API
      return await this.generateText(ragPrompt, 0.3, 1500);
    } catch (error) {
      console.error('RAG生成回复时出错:', error);
      throw new Error('无法生成回复，请稍后重试');
    }
  }

  /**
   * 创建角色
   * @param prompt 角色创建提示
   * @returns 生成的角色描述
   */
  async createCharacter(prompt: string): Promise<string> {
    const characterPrompt = `请为一个剧本杀游戏创建一个引人入胜的角色。根据以下信息创建:
${prompt}

请提供:
1. 角色姓名
2. 年龄和职业
3. 详细的背景故事
4. 性格特点
5. 主要动机和目标
6. 与其他角色的潜在关系

以详细的角色描述形式回复，不要使用标题或分隔符。`;

    return await this.generateText(characterPrompt, 0.8, 2000);
  }

  /**
   * 优化剧本大纲
   * @param outline 原始大纲
   * @returns 优化后的大纲
   */
  async improveOutline(outline: string): Promise<string> {
    const improvePrompt = `我有一个剧本杀游戏的初步大纲，请帮我完善和优化它，使其更加引人入胜和逻辑严密。

原始大纲:
${outline}

请优化以下几个方面:
1. 故事结构和情节节奏
2. 核心矛盾和冲突
3. 悬念和线索设计
4. 世界观和背景细节

请保持原始大纲的主要元素和主题，但可以添加细节、调整结构或提出改进建议。`;

    return await this.generateText(improvePrompt, 0.6, 3000);
  }
}

// 导出单例
export default new GeminiService(); 