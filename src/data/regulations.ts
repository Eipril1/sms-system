// 规章数据
export const regulations = [
  {
    id: '1',
    regNumber: 'CCAR-121',
    regName: '大型飞机公共航空运输承运人运行合格审定规则',
    regType: 'CCAR',
    publishDate: '2023-01-01',
    effectiveDate: '2023-03-01',
    status: '有效'
  },
  {
    id: '2',
    regNumber: 'CCAR-396',
    regName: '民用航空安全管理规定',
    regType: 'CCAR',
    publishDate: '2023-02-01',
    effectiveDate: '2023-04-01',
    status: '有效'
  }
]

// 规章条款树
export const clauseTree = [
  {
    id: '1',
    clauseNo: '1',
    clauseTitle: '总则',
    children: [
      {
        id: '1-1',
        clauseNo: '1.1',
        clauseTitle: '目的和依据',
        requirement: '本咨询通告依据中国民用航空规章《大型飞机公共航空运输承运人运行合格审定规则》(CCAR-121 部)和《小型商业运输和空中游览运营人运行合格审定规则》(CCAR-135 部)制定，目的是指导大型飞机公共航空运输承运人和小型商业运输运营人(以下简称"航空运营人")建立符合要求的安全管理体系(以下简称"SMS")。'
      },
      {
        id: '1-2',
        clauseNo: '1.2',
        clauseTitle: '适用范围',
        requirement: '本咨询通告适用于按照 CCAR-121 部运行的航空运营人;按照 CCAR-135 部运行的航空运营人可参照执行。对于航空运营人按照 CCAR-145 部获得批准的国内维修单位，应当按照相关要求建立质量安全管理体系(QSMS)。'
      }
    ]
  },
  {
    id: '2',
    clauseNo: '2',
    clauseTitle: '安全管理体系要求',
    children: [
      {
        id: '2-1',
        clauseNo: '2.1',
        clauseTitle: '管理者承诺',
        requirement: '最高管理者应当通过以下方式表明其对建立、实施和持续改进 SMS 的承诺：(a)制定安全政策；(b)建立安全目标；(c)任命关键安全人员；(d)确保可用资源；(e)确保开展安全培训。'
      }
    ]
  }
]

// 符合性声明数据
export const complianceData = [
  {
    id: '1',
    regClauseId: '1-1',
    clauseNo: '1.1',
    requirement: '本咨询通告依据中国民用航空规章...',
    manualCode: 'DY-1Y-03',
    manualClause: '1.1.1',
    statement: '公司安全管理手册DY-1Y-03第1.1.1章节明确规定了SMS的建立依据和目的...',
    status: '有效'
  },
  {
    id: '2',
    regClauseId: '1-2',
    clauseNo: '1.2',
    requirement: '本咨询通告适用于...',
    manualCode: 'SMS',
    manualClause: '1.2.1',
    statement: 'SMS手册1.2.1章节规定了手册适用范围，包括CCAR-121运行的所有活动...',
    status: '有效'
  }
] 