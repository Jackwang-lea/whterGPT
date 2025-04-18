import GeminiService from './GeminiService';
import { KnowledgeFragment } from '../types';

/**
 * 检索增强生成(RAG)服务
 * 结合知识库检索和Gemini生成，提供上下文感知的回答
 */
class RagService {
  // 模拟知识库集合，实际项目中应从数据库或文件加载
  private knowledgeBase: KnowledgeFragment[] = [];
  
  /**
   * 初始化RAG服务
   */
  constructor() {
    console.log('RAG服务初始化...');
  }
  
  /**
   * 设置知识库
   * @param fragments 知识片段集合
   */
  setKnowledgeBase(fragments: KnowledgeFragment[]): void {
    this.knowledgeBase = fragments;
    console.log(`知识库已更新，共包含${fragments.length}个文档片段`);
  }
  
  /**
   * 添加知识片段
   * @param fragment 知识片段
   */
  addKnowledgeFragment(fragment: KnowledgeFragment): void {
    this.knowledgeBase.push(fragment);
  }
  
  /**
   * 进行语义检索，寻找与查询相关的知识片段
   * @param query 用户查询
   * @param topK 返回的最相关文档数
   * @returns 相关知识片段
   */
  private retrieveRelevantDocuments(query: string, topK: number = 3): KnowledgeFragment[] {
    // 简单实现：基于关键词匹配
    // 实际应使用向量数据库或更复杂的语义检索算法
    
    // 将查询拆分为关键词
    const keywords = query
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 1);
    
    // 为每个文档计算匹配分数
    const scoredDocs = this.knowledgeBase.map(doc => {
      const content = (doc.title + ' ' + doc.content).toLowerCase();
      
      // 计算包含关键词的数量
      const matchScore = keywords.reduce((score, keyword) => {
        return score + (content.includes(keyword) ? 1 : 0);
      }, 0);
      
      return { doc, score: matchScore };
    });
    
    // 按分数排序并返回前topK个文档
    return scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(item => item.score > 0)
      .map(item => item.doc);
  }
  
  /**
   * 处理用户查询，返回基于知识库的回答
   * @param query 用户查询
   * @returns 生成的回答
   */
  async answerQuery(query: string): Promise<string> {
    try {
      // 检索相关文档
      const relevantDocs = this.retrieveRelevantDocuments(query);
      
      if (relevantDocs.length === 0) {
        // 如果没有找到相关文档，使用一般知识回答
        return await GeminiService.generateText(
          `请回答以下问题，如果不确定，请明确表示："${query}"`
        );
      }
      
      // 格式化检索到的文档
      const formattedDocs = relevantDocs.map(doc => {
        return `标题: ${doc.title}\n内容: ${doc.content}`;
      });
      
      // 使用RAG生成回答
      return await GeminiService.generateRagResponse(query, formattedDocs);
    } catch (error) {
      console.error('RAG处理查询时出错:', error);
      return '抱歉，我无法处理您的问题，请稍后再试。';
    }
  }
  
  /**
   * 获取与指定主题相关的知识片段
   * @param topic 主题关键词
   * @returns 相关知识片段数组
   */
  getKnowledgeByTopic(topic: string): KnowledgeFragment[] {
    return this.retrieveRelevantDocuments(topic, 5);
  }
}

// 导出单例
export default new RagService(); 