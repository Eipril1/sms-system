import axios from 'axios'
import cheerio from 'cheerio'

// 规章类型定义
const REG_TYPES = {
  CCAR: 'CCAR',
  AC: 'AC',
  OTHER: 'OTHER'
}

// 抓取规章列表
export async function crawlRegulationList() {
  const baseUrl = 'https://www.caac.gov.cn/XXGK/XXGK'
  const pages = ['index_172.html', 'index_173.html'] // 可以添加更多页面
  
  const regulations = []
  
  for (const page of pages) {
    const url = `${baseUrl}/${page}`
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    
    $('.zw_content li').each((_, el) => {
      const $el = $(el)
      const title = $el.find('a').text().trim()
      const link = $el.find('a').attr('href')
      const date = $el.find('.date').text().trim()
      
      // 解析规章编号和类型
      const regInfo = parseRegulationInfo(title)
      
      if (regInfo) {
        regulations.push({
          ...regInfo,
          title,
          link,
          publishDate: date,
          status: '有效'
        })
      }
    })
  }
  
  return regulations
}

// 抓取规章详情
export async function crawlRegulationDetail(url: string) {
  const { data } = await axios.get(url)
  const $ = cheerio.load(data)
  
  // 解析规章内容
  const content = $('.TRS_Editor').text().trim()
  
  // 解析规章条款
  const clauses = parseRegulationClauses(content)
  
  return {
    content,
    clauses
  }
}

// 解析规章信息
function parseRegulationInfo(title: string) {
  // 匹配规章编号
  const ccarMatch = title.match(/CCAR-\d+/)
  const acMatch = title.match(/AC-\d+/)
  
  if (ccarMatch) {
    return {
      regNumber: ccarMatch[0],
      regType: REG_TYPES.CCAR
    }
  }
  
  if (acMatch) {
    return {
      regNumber: acMatch[0],
      regType: REG_TYPES.AC
    }
  }
  
  return null
}

// 解析规章条款
function parseRegulationClauses(content: string) {
  const clauses = []
  const lines = content.split('\n')
  
  let currentClause = null
  
  for (const line of lines) {
    // 匹配章节号，如 "1.1.1"
    const clauseMatch = line.match(/^(\d+\.)+\d+\s+(.+)/)
    
    if (clauseMatch) {
      if (currentClause) {
        clauses.push(currentClause)
      }
      
      currentClause = {
        clauseNo: clauseMatch[1].trim(),
        clauseTitle: clauseMatch[2].trim(),
        content: '',
        children: []
      }
    } else if (currentClause) {
      currentClause.content += line.trim() + '\n'
    }
  }
  
  if (currentClause) {
    clauses.push(currentClause)
  }
  
  return buildClauseTree(clauses)
}

// 构建条款树
function buildClauseTree(clauses: any[]) {
  const tree = []
  const map = new Map()
  
  for (const clause of clauses) {
    map.set(clause.clauseNo, clause)
    
    const parent = findParentClause(clause.clauseNo, map)
    if (parent) {
      parent.children.push(clause)
    } else {
      tree.push(clause)
    }
  }
  
  return tree
}

// 查找父条款
function findParentClause(clauseNo: string, map: Map<string, any>) {
  const parts = clauseNo.split('.')
  if (parts.length <= 1) return null
  
  const parentNo = parts.slice(0, -1).join('.')
  return map.get(parentNo)
} 