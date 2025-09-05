/**
 * JSON5 Parser for SecureVision AI
 * 简单的JSON5解析工具，用于处理带注释的产品数据文件
 */

class JSON5Parser {
  /**
   * 解析JSON5字符串为JavaScript对象
   * @param {string} json5String - JSON5格式的字符串
   * @returns {Object} 解析后的JavaScript对象
   */
  static parse(json5String) {
    try {
      // 简单的注释移除方法
      const cleanedString = this.removeComments(json5String);
      
      // 使用eval解析（注意：生产环境中应该使用更安全的方法）
      // 这里为了简化，直接使用eval，实际项目中建议使用JSON5库
      return eval('(' + cleanedString + ')');
    } catch (error) {
      console.error('JSON5 parsing error:', error);
      throw new Error('Failed to parse JSON5: ' + error.message);
    }
  }
  
  /**
   * 移除JSON5中的注释
   * @param {string} str - 原始字符串
   * @returns {string} 移除注释后的字符串
   */
  static removeComments(str) {
    // 移除单行注释 //
    str = str.replace(/\/\/.*$/gm, '');
    
    // 移除多行注释 /* */
    str = str.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // 移除行末的逗号（JSON5允许，但标准JSON不允许）
    // 这里保留，因为我们会用eval处理
    
    return str;
  }
  
  /**
   * 异步加载JSON5文件
   * @param {string} url - 文件URL
   * @returns {Promise<Object>} Promise对象，resolve时返回解析后的数据
   */
  static async loadFile(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json5String = await response.text();
      return this.parse(json5String);
    } catch (error) {
      console.error(`Failed to load JSON5 file from ${url}:`, error);
      throw error;
    }
  }
  
  /**
   * 加载产品主配置文件
   * @returns {Promise<Object>} 产品主配置数据
   */
  static async loadProductsMaster() {
    return this.loadFile('/products/data/products-master.json5');
  }
  
  /**
   * 加载编译后的产品索引文件 (用于产品列表页面)
   * @returns {Promise<Object>} 编译后的产品索引数据
   */
  static async loadProductsIndex() {
    try {
      const response = await fetch('/products/data/compiled/index.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load products index:', error);
      throw error;
    }
  }
  
  /**
   * 加载单个产品数据
   * @param {string} productId - 产品ID
   * @returns {Promise<Object>} 产品数据
   */
  static async loadProduct(productId) {
    return this.loadFile(`/products/data/products/${productId}.json5`);
  }
}

// 全局暴露，便于其他脚本使用
window.JSON5Parser = JSON5Parser;

// 使用示例：
/*
// 加载产品主配置
JSON5Parser.loadProductsMaster().then(config => {
  console.log('Products config loaded:', config);
});

// 加载单个产品
JSON5Parser.loadProduct('svc138').then(product => {
  console.log('Product loaded:', product);
});

// 直接解析JSON5字符串
const json5String = `{
  // 这是注释
  name: "测试产品",
  features: ["特性1", "特性2"],  // 尾随逗号
}`;
const data = JSON5Parser.parse(json5String);
*/