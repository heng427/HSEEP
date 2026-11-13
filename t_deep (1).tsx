import React, { useState, useEffect } from 'react';

// --- 1. 六大演習規劃步驟定義 (依臺北市 T-DEEP 與美國 HSEEP 指引) ---
const STEPS = [
  {
    title: 'STEP 1：概念與目標會議 (C&O)',
    subtitle: '確立演習範疇 (Scope)、籌組規劃小組與甘特圖里程碑',
    guidance: '演習規劃的開端。選定災害主軸、演習工具（討論型或操作型）與預期參與層級，並成立「演習規劃小組」（可兼任控制官/評估員，但嚴禁兼任參演者）。',
    outputs: ['演習概念與初步範疇', '演習規劃小組權責名冊', '籌備甘特圖 (Gantt Chart)'],
    scenarioTips: '參考《地區災害防救計畫》高風險項目，由簡入繁採循序漸進式規劃。'
  },
  {
    title: 'STEP 2：初步規劃會議 (IPM)',
    subtitle: '訂定 SMART 演習目標 (Objectives) 與核心能力 (Core Capabilities)',
    guidance: '依據災害風險設定 2~5 個具體可評量的演習目標，並展開達成目標所需的核心能力與關鍵任務。',
    outputs: ['SMART 演習目標清單', '核心能力與關鍵任務對照表', '演習計畫草案'],
    scenarioTips: '善用下方「SMART 造句機」，明確定義「時限、執行單位、依據 SOP、量化任務」。'
  },
  {
    title: 'STEP 3：期中規劃會議 (MPM)',
    subtitle: '設計災害背景 (Ground Truth)、場地動線與實戰戰術／傷病模組',
    guidance: '建構初始災害情境背景、規劃實體隔離的救災與觀摩動線，並選定欲測試的消防搶救戰術與救護傷病模組。',
    outputs: ['初始實況背景 (Ground Truth)', '場地配置與動線分流圖', '實戰戰術與傷病模組清單'],
    scenarioTips: '可勾選下方消防戰術與臨床疾病模組，一鍵自動生成第四階段的 MSEL 狀況卡。'
  },
  {
    title: 'STEP 4：主境況事件清單會議 (MSELM)',
    subtitle: '撰寫主境況事件清單 (MSEL) 與控制／評估分工',
    guidance: '依時間軸設計突發狀況 (Inject) 與應急引導狀況 (Contingency Inject)，每筆狀況皆須對應演習目標與預期處置作為。',
    outputs: ['主境況事件清單 (MSEL)', '控制官與評估員分工表'],
    scenarioTips: '切記「無目標不設狀況」，避免為了製造混亂而下達無法評估的干擾事件。'
  },
  {
    title: 'STEP 5：最終規劃會議 (FPM)',
    subtitle: '行政後勤總檢查、安全把關與分眾事前簡報 (Briefings)',
    guidance: '演練前最後確認，此時「不再大幅修改劇本」。重點檢核場地安全、緊急停止口令、無線電頻道隔離與人員訓練。',
    outputs: ['場地安全與後勤檢核表', '各角色事前簡報 (Briefings)'],
    scenarioTips: '建議切換至左側「🎓 角色任務訓練」，讓控制官、評估員與參演者完成職前訓練。'
  },
  {
    title: 'STEP 6：演習執行、評估與精進 (AAR/IP)',
    subtitle: '即時反饋 (Hotwash)、P/S/M/U 能力評級與 5Why 根本原因分析',
    guidance: '演練結束後 30 分鐘內召開 Hotwash；評估員依 EEG 給予 P/S/M/U 評級，針對缺失進行 5Why 追問並產出 SMART 改善計畫。',
    outputs: ['事件後報告暨改善計畫 (AAR/IP)', '控制官與評估手冊', '傷患症狀卡與 Hotwash 問卷'],
    scenarioTips: '秉持「無責備學習文化 (No-fault)」，聚焦檢討計畫、裝備與訓練缺口，而非怪罪個人。'
  }
];

// --- 2. 消防救災戰術模組 ---
const FIRE_TACTICS_DATA = [
  {
    id: 'ft_hose',
    title: '延伸水線與水源中繼',
    tag: '水線部署',
    event: '起火層室內消防栓水壓不足，自衛消防班初期滅火受阻；轄區消防分隊抵達後需自消防車佈設雙水線並透過安全梯延伸至高樓層。',
    action: '1. 自衛消防班確認無法撲滅後果斷撤離並關閉防火門。 2. 警消利用樓梯間乾式立管或梯間垂吊佈線，建立中繼加壓確保瞄子水壓。'
  },
  {
    id: 'ft_spread',
    title: '防止延燒與防火區劃阻絕',
    tag: '區劃防護',
    event: '火勢因可燃物與管線間隙有向上層及鄰接區劃竄燒趨勢，走廊濃煙能見度驟降至 1 公尺以下。',
    action: '1. 立即關閉所有常開式防火門及防火鐵捲門，確認空調排煙系統連動關閉防煙風門。 2. 警消於鄰接區劃與上層部署防護水線阻絕延燒。'
  },
  {
    id: 'ft_rit',
    title: '快速人命搜救 (RIT)',
    tag: '人命搜救',
    event: '病房/包廂清點發現尚有 2 名行動不便者失聯受困於濃煙區，且天花板輕鋼架發生局部塌陷。',
    action: '1. 指揮官立即指派搜救小組攜帶熱顯像儀 (TIC) 與共生面罩進入搜索。 2. 同步成立快速救援小組 (RIT) 於安全區待命，確保救災人員安全。'
  },
  {
    id: 'ft_gas',
    title: '醫用氣體與危險物遮斷',
    tag: '危害控制',
    event: '震後引發管線鬆脫，起火點鄰近氧氣供應支管，高濃度氧氣助長火勢猛烈燃燒。',
    action: '1. 工務人員穿戴防護裝備，依安全界限判定關閉該分區醫用氣體區域閥箱 (Zone Valve)。 2. 若火勢過大危及人員，嚴禁強行進入，立即退守防火區劃外。'
  }
];

// --- 3. 緊急救護與特殊臨床疾病模組 ---
const EMS_DISEASES_DATA = [
  {
    id: 'ems_vent',
    title: '急性呼吸衰竭（依賴呼吸器重症）',
    tag: '紅色檢傷',
    vitals: 'SpO2: 82% ↓, RR: 32次/分, HR: 135次/分, BP: 95/60 mmHg',
    symptoms: '意識躁動、呼吸急促、發紺；原使用床邊呼吸器因斷電與供氧中斷發出高音警報。',
    actingHint: '臨演表現出極度喘促、無法完整說話，指著喉嚨與氧氣管線表情痛苦。',
    event: '加護病房 03 床呼吸衰竭患者因中央供氧中斷，血氧飽和度驟降至 82%，需立即維持通氣並水平轉移。',
    action: '1. 呼吸治療師與護理師立即切換「手動甦醒球 (Ambu bag) + 攜帶式 E 型氧氣鋼瓶」。 2. 確認鋼瓶存量足以支撐 20 分鐘以上，以連床帶人方式優先水平疏散。'
  },
  {
    id: 'ems_inhal',
    title: '吸入性灼傷與急性呼吸道水腫',
    tag: '紅色檢傷',
    vitals: 'SpO2: 88%, RR: 28次/分, HR: 128次/分, 聲音沙啞',
    symptoms: '鼻毛燒焦、口咽部有碳粒痰液、聲音明顯沙啞並出現吸氣性喘鳴 (Stridor)。',
    actingHint: '臨演持續劇烈咳嗽、聲音刻意壓低沙啞、手握頸部表示喉嚨腫痛呼吸困難。',
    event: '火場濃煙區救出 1 名受困者，口鼻周圍燻黑且聲音沙啞，有快速上呼吸道水腫阻塞風險。',
    action: '1. 檢傷站立即判為第一優先（紅色）重症，給予高濃度氧氣面罩。 2. 緊急醫療小組準備早期氣管內管插管 (ETI) 器材，優先安排後送醫學中心燒燙傷中心。'
  },
  {
    id: 'ems_dialysis',
    title: '洗腎患者緊急中斷透析撤離',
    tag: '黃色/紅色檢傷',
    vitals: 'BP: 165/95 mmHg, HR: 102次/分, 動靜脈瘻管連接中',
    symptoms: '患者正接受血液透析中，因地震跳電與火災警報需緊急中斷治療並撤離。',
    actingHint: '臨演表現焦慮緊張，提醒醫護人員手臂上還插著洗腎管路不能直接拉扯。',
    event: '洗腎機因斷電停止運轉，患者動靜脈瘻管仍與管路相連，需在 3 分鐘內完成緊急離機撤離。',
    action: '1. 護理師依標準「雙夾剪斷法 (Clamp & Cut)」夾閉動靜脈端管路後剪斷分離，保留針頭以無菌紗布包紮固定。 2. 協助患者坐輪椅迅速撤往安全區。'
  },
  {
    id: 'ems_co',
    title: '一氧化碳／氰化物複合濃煙中毒',
    tag: '紅色檢傷',
    vitals: 'SpO2: 99%(假性正常), GCS: E2V2M4 (昏迷), BP: 85/50 mmHg',
    symptoms: '從密閉暗室救出，意識模糊昏迷、皮膚潮紅、伴隨嚴重代謝性酸中毒與低血壓。',
    actingHint: '臨演呈昏睡意識不清狀態，對呼喚反應遲鈍、全身無力癱軟。',
    event: '暗室包廂內救出 1 名昏迷民眾，脈搏血氧機顯示 99% 但患者意識不清且血壓偏低。',
    action: '1. 辨識一氧化碳中毒可能導致血氧機假性正常，立即給予 100% 純氧（非再吸入型面罩 NRM）。 2. 懷疑合併氰化物中毒時，聯繫毒災應變隊或後送具備解毒劑 (Cyanokit) 之醫院。'
  }
];

// --- 4. SWEAT-M 與 PACE 靈感庫 ---
const SWEATM_PRESETS = [
  { cat: 'Electricity 電力中斷', event: '主電源跳脫且緊急發電機因震動延遲 3 分鐘啟動，部分非緊急照明與電動門失效。', action: '啟動手電筒照明，手動解鎖電動門磁力鎖，確認維生設備電池切換正常。' },
  { cat: 'Telecommunication 通訊失靈 (PACE)', event: '院內/大樓桌機總機線路受損忙線，主方案通訊中斷。', action: '依 PACE 原則立即切換備援方案 (Alteration)：使用無線電備用頻道及公務手機群組通報。' },
  { cat: 'Accessibility 交通動線受阻', event: '主要疏散樓梯因天花板掉落物阻塞，且 1 樓大門有大批家屬與圍觀民眾聚集。', action: '避難引導班改導引至第二安全梯；警衛班拉設警戒線隔離家屬與救護車動線。' },
  { cat: 'Water 消防與民生用水異常', event: '受災區域自動灑水頭因管線破裂持續噴水，導致走道積水濕滑影響擔架搬運。', action: '工務組關閉該分區灑水控制閥並進行排水，疏散人員改採防滑搬運墊執行轉移。' }
];

// --- 5. 角色分類定義 ---
const ROLE_CATEGORIES = [
  {
    group: '一、規劃與指揮層級 (Planning & Leadership)',
    color: 'blue',
    roles: [
      { key: 'director', label: '演習召集人 (Exercise Director)', desc: '總策畫與策略督導，具備決策能力' },
      { key: 'teamLead', label: '演習規劃團隊負責人 (Team Lead)', desc: '統籌規劃小組進度、跨單位協調' },
      { key: 'safetyOfficer', label: '安全／保全官 (Safety Officer)', desc: '確保演習場地安全、訂定緊急中止機制' },
      { key: 'designLead', label: '設計與開發組長 (Design & Dev)', desc: '負責情境開發、MSEL 與模擬建置' },
      { key: 'logisticsLead', label: '資源與後勤組長 (Logistics Lead)', desc: '場地佈置、行政庶務、預算與物資' }
    ]
  },
  {
    group: '二、執行與控制架構 (Execution & Control / MCC)',
    color: 'amber',
    roles: [
      { key: 'masterController', label: '總控制官／首席促成者 (MC / Facilitator)', desc: '掌握演練時序、引導討論或統籌狀況下達' },
      { key: 'seniorController', label: '進階控制官 (Senior Controller, SC)', desc: '負責總控制組與各現場控制官之通訊聯繫' },
      { key: 'mselManager', label: 'MSEL 管理者 (MSEL Manager, MM)', desc: '依時序控管狀況卡注入與模擬小組調度' },
      { key: 'venueControllers', label: '現場控制官群 (Venue Controllers, VC)', desc: '派駐第一線各場景下達狀況（可填多位）' },
      { key: 'simCellLead', label: '模擬小組負責人 (Simulation Cell)', desc: '管理災民臨演、假人道具、傷情卡與電話模擬' }
    ]
  },
  {
    group: '三、觀察與評估小組 (Evaluation Team)',
    color: 'red',
    roles: [
      { key: 'leadEvaluator', label: '首席評估員 (Lead Evaluator)', desc: '統籌評估標準一致性、彙整事件後報告' },
      { key: 'evaluators', label: '現場評估員與紀錄員 (Evaluators)', desc: '對照 SOP 與目標進行客觀觀察與計時（可填多位）' }
    ]
  },
  {
    group: '四、參演單位與外部支援 (Players & Whole Community)',
    color: 'emerald',
    roles: [
      { key: 'playersLead', label: '受驗證參演單位與帶隊官 (Players)', desc: '實際執行決策、調度與第一線搶救之受測人員' },
      { key: 'externalPartners', label: '外部支援與專家學者 (SME / Partners)', desc: '消防、衛生局、警政、社區或主題領域專家' }
    ]
  }
];

// --- 6. 各角色訓練課程資料庫 ---
const ROLE_TRAINING_CURRICULUM = {
  director: {
    badge: '策略決策與文化定調',
    clearance: 'SECRET',
    spiritTitle: '營造「無責備學習文化」，讓演習成為發現制度缺口的機會',
    spiritSummary: '演習召集人不是來「看秀」或「打考績」的。依 T-DEEP 與 HSEEP 精神，召集人必須向全體宣示：演習的目的是「驗證計畫與制度」，在安全環境中暴露問題遠比在真實災害中失敗更有價值。',
    goldenRules: [
      '禁止追求「零缺點完美演出」：毫無瑕疵通常代表情境太簡單，無法測試組織極限。',
      '確立「無責備環境 (No-fault Environment)」：犯錯不懲處個人，而是檢討 SOP 與資源缺口。',
      '掌控策略方向與目標數量：中小型演習建議 2~3 個目標，大型演習 3~5 個目標，避免失焦。',
      '親自督導事件後精進計畫 (IP)：確保缺失能轉化為明年度預算、裝備採購或法規修訂。'
    ],
    tasks: [
      { phase: '演前規劃', text: '主持概念與目標會議 (C&O)，核定演習範疇與 SMART 目標。' },
      { phase: '演前規劃', text: '指派具備跨單位協調能力的規劃團隊負責人 (Team Lead) 與安全官。' },
      { phase: '演練當日', text: '於開場簡報重申演習安全第一原則與「無責備學習」精神。' },
      { phase: '演後精進', text: '核定事件後報告 (AAR/IP)，追蹤各單位改善措施之執行進度。' }
    ],
    quiz: [
      {
        q: '演練中某單位因不熟悉新購備援設備導致疏散慢了 5 分鐘，身為演習召集人應如何處置？',
        options: [
          '當場指責該單位平時訓練不精，要求立刻重演一遍',
          '保持冷靜不干預現場，並於事件後會議將此列為「裝備與訓練缺口」，指示辦理實機技術訓練 (Drill)',
          '為求長官視察畫面完美，請控制官直接跳過該環節'
        ],
        ans: 1,
        exp: '正確！T-DEEP 強調演習是「發現問題、解決問題」的整備工具，不干預現場操作，透過無責備環境找出制度與訓練缺口才是真精神。'
      }
    ]
  },
  teamLead: {
    badge: '專案統籌與進度控管',
    clearance: 'SECRET',
    spiritTitle: '按部就班推動規劃會議，嚴守「可信任成員 (Trusted Agent)」保密紀律',
    spiritSummary: '規劃團隊負責人是整場演習的專案經理 (PM)，運用甘特圖控管各階段會議里程碑，並嚴防「球員兼裁判」洩漏題目。',
    goldenRules: [
      '嚴格區隔規劃組與參演者：規劃小組可兼任控制官或評估員，但「絕對不可兼任參演者」。',
      '漸進式聚焦原則：先定範疇 (Scope) → 再定目標 (Objectives) → 最後寫劇本 (MSEL)。',
      '最終規劃會議 (FPM) 凍結設計：演練前最後一次會議只確認行政後勤，不再大幅修改劇本。',
      '建立跨機關共通語言：確保醫療、消防、工務與外部支援單位對術語與動線達成共識。'
    ],
    tasks: [
      { phase: '演前規劃', text: '建立演習籌備甘特圖，依序召開 C&O、IPM、MPM、MSEL/評估會議與 FPM。' },
      { phase: '演前規劃', text: '檢核人員編組名冊，確保無人員同時列於「控制/評估組」與「參演人員」。' },
      { phase: '演練當日', text: '協助總控制組與安全官確認各場地報到、識別證發放與事前簡報完成。' },
      { phase: '演後精進', text: '於演練結束後 30 分鐘內協助舉辦 Hotwash，並彙整觀察紀錄撰寫 AAR 草稿。' }
    ],
    quiz: [
      {
        q: '距離正式演習只剩 3 天（已開完最終規劃會議 FPM），某主管要求在 MSEL 新增一個大型化災場景，您該如何處理？',
        options: [
          '立刻答應並修改所有手冊，即使其他單位來不及準備也沒關係',
          '婉拒大幅變更，說明依 T-DEEP 原則最終規劃會議後應凍結設計以確保安全與評估一致性，可納入下次演習規劃',
          '偷偷把新狀況塞給控制官，連評估員都不通知'
        ],
        ans: 1,
        exp: '正確！最終規劃會議 (FPM) 的精神在於確認行政後勤與安全，不應再對演習計畫與情境進行大幅修改。'
      }
    ]
  },
  safetyOfficer: {
    badge: '最高安全否決權與風險控管',
    clearance: 'SECRET',
    spiritTitle: '演習安全永遠高於演練逼真度，擁有「隨時喊停」的最高權限',
    spiritSummary: '安全官負責在場地佈置、造煙機使用、假人搬運及演練過程中進行全時安全監控，一旦發生真實意外，必須立即啟動緊急中止程序。',
    goldenRules: [
      '擁有最高安全中止權：任何現場控制官或安全官發現真實危害，有權立即宣布暫停演習。',
      '明確區分「演習狀況」與「真實意外」：全體人員必須熟記緊急停止口令（如：「真實意外，停止演習」）。',
      '實體動線分流檢核：確保救災動線、傷患後送動線與貴賓觀察員動線完全隔離不交錯。',
      '特殊效果與道具許可：確認發煙機、模擬斷電或人員搬運皆有安全防護與滅火備援。'
    ],
    tasks: [
      { phase: '演前規劃', text: '執行場地安全會勘，審查道具、造煙機及假人搬運之職業安全風險。' },
      { phase: '演前規劃', text: '制定「真實緊急事件應變與中止程序」，並宣達給全體參與人員。' },
      { phase: '演練當日', text: '於各分組事前簡報 (Briefings) 中親自宣達安全守則與緊急中止口令。' },
      { phase: '演練當日', text: '全程巡視高風險區域（如樓梯間疏散、消防水線操作區），隨時排除物理障礙。' }
    ],
    quiz: [
      {
        q: '演習進行中，一名扮演傷患的臨演在疏散時不慎真實扭傷腳踝且無法站立，安全官與現場控制官應如何處置？',
        options: [
          '叫他忍耐繼續演，剛好測試救護班的臨場反應',
          '立即喊出「真實意外，停止演習 (Real-World Emergency)」口令，暫停該區演練並由真實醫護人員進行處置',
          '等演習結束後再帶他去掛急診'
        ],
        ans: 1,
        exp: '完全正確！真實人員受傷時，必須立刻啟動真實意外中止程序，確保人員安全是最高鐵律。'
      }
    ]
  },
  designLead: {
    badge: '情境開發與邏輯架構',
    clearance: 'SECRET',
    spiritTitle: '以「真實風險」為本，設計具連貫性且可驗證目標的情境',
    spiritSummary: '設計與開發組長將抽象目標轉化為逼真的災害背景 (Ground Truth) 與主境況事件清單 (MSEL)，確保每個事件都有因果邏輯。',
    goldenRules: [
      '目標導向設計：每一筆 MSEL 狀況卡都必須能對應到至少一個「演習目標」。',
      '結合 SWEAT-M 與 PACE 原則：適度納入水、電、交通、通訊、醫療等基礎設施中斷考驗。',
      '設計「應急引導狀況 (Contingency Inject)」：預先設想若參演者漏掉關鍵動作，如何用備用卡拉回主軸。',
      '符合真實時間與空間邏輯：援軍抵達時間與火勢蔓延速度必須符合實務常理。'
    ],
    tasks: [
      { phase: '演前規劃', text: '蒐集歷史災例與風險評估數據，撰寫合理的初始災害背景資訊 (Ground Truth)。' },
      { phase: '演前規劃', text: '主持 MSEL 會議，與主題專家共同確認預期處置作為的專業正確性。' },
      { phase: '演前規劃', text: '協助模擬小組製作逼真的傷患症狀卡與通報字條。' },
      { phase: '演後精進', text: '檢討情境難易度與真實性回饋，作為未來進階演練設計之修正依據。' }
    ],
    quiz: [
      {
        q: '在設計 MSEL 主境況事件清單時，為什麼需要設計「應急引導狀況 (Contingency Inject)」？',
        options: [
          '為了故意刁難參演者，讓他們一定會不及格',
          '當參演者未採取預期行動、導致後續關鍵場景無法推進時，由控制官適時注入以將演練拉回主軸',
          '用來取代原本的演習目標'
        ],
        ans: 1,
        exp: '正確！Contingency Inject 是控制團隊的安全網，確保演習不會因為單一環節卡關而無法驗證後續核心能力。'
      }
    ]
  },
  logisticsLead: {
    badge: '場地整備與後勤支援',
    clearance: 'SECRET',
    spiritTitle: '完善無礙的後勤與動線隔離，是演習順暢執行的隱形基石',
    spiritSummary: '後勤組負責場地協調、通訊設備（無線電頻道隔離）、識別證背心製作、造煙機整備及貴賓觀察區規劃。',
    goldenRules: [
      '視覺化角色識別：參演者、控制官、評估員、演員、觀察員必須配戴不同顏色背心或識別證。',
      '無線電頻道隔離：控制組內部通訊頻道必須與參演單位的救災通訊頻道分開，避免破梗。',
      '觀摩與救災動線分離：貴賓觀察區必須劃設清楚，嚴禁跨越警戒線干擾第一線搶救。',
      '預先通知周邊單位：實兵演練前務必通知鄰近居民、119/110 勤務中心與大樓管理室，避免誤報恐慌。'
    ],
    tasks: [
      { phase: '演前規劃', text: '確認各演練場地借用許可、無線電頻道分配表與各角色背心/名牌製作。' },
      { phase: '演前規劃', text: '與機電/總務確認發煙機測試，避免誤觸真實火警廣播與自動灑水系統。' },
      { phase: '演練當日', text: '提前到場完成報到處、總控制組 (MCC)、模擬區與貴賓觀察區之佈置。' },
      { phase: '演後復原', text: '演練結束 (EndEx) 後清點回收所有道具、通訊器材並恢復場地營運。' }
    ],
    quiz: [
      {
        q: '在醫院或商場進行實兵演練時，關於「控制組無線電」與「參演單位無線電」的設定，下列何者正確？',
        options: [
          '大家共用同一個頻道，比較節省對講機',
          '控制組與參演單位必須使用不同頻道隔離，避免控制官聯繫 MSEL 進度時被參演者聽見而破梗',
          '演習期間禁止使用任何無線電'
        ],
        ans: 1,
        exp: '正確！通訊頻道隔離是控制架構的基本要求，避免參演者提前聽到突發狀況安排。'
      }
    ]
  },
  masterController: {
    badge: '節奏掌控與情境引導',
    clearance: 'SECRET',
    spiritTitle: '掌控演練節奏的指揮家，「引導而不介入、下達而不提示」',
    spiritSummary: '在討論型演習 (TTX) 中您是「促成者 (Facilitator)」，負責提問引導；在操作型演習 (FE/FSE) 中您是「總控制官 (MC)」，負責統籌總控制組掌握全場時序。',
    goldenRules: [
      '嚴守中立不代為決策：只負責拋出問題與情境，絕不直接告訴參演者「標準答案是什麼」。',
      '靈活調整時序節奏：若現場處置速度比預期快或慢，總控制官有權微調 MSEL 下達時間。',
      '掌控 StartEx 與 EndEx：統一宣布演習正式開始與結束，並與安全官保持熱線暢通。',
      '引導深層對話 (討論型)：善用追問技巧挖掘計畫與跨單位介面盲點。'
    ],
    tasks: [
      { phase: '演前規劃', text: '主持控制官與評估員事前簡報，確認全員熟悉 MSEL 時序與通訊協定。' },
      { phase: '演練當日', text: '進駐總控制組 (MCC)，發布 StartEx 啟動演練。' },
      { phase: '演練當日', text: '監控各場景進度，決定是否核准釋出「應急引導狀況 (Contingency Inject)」。' },
      { phase: '演後即時', text: '發布 EndEx 結束演練，並主持或協助進行 30 分鐘內的 Hotwash 即時反饋。' }
    ],
    quiz: [
      {
        q: '桌上推演進行中，某單位主管對權責分工猶豫不決，轉頭問您：「主推官，這件事依規定到底該由誰負責？」您該如何回應？',
        options: [
          '直接翻開法規唸出答案，幫他們節省討論時間',
          '將問題拋回給在場相關單位：「這正是今天推演要釐清的關鍵！請兩位主管依據現行計畫討論看看，真實災害時現場會怎麼協調？」',
          '跳過這個議題，直接進入下一個簡報'
        ],
        ans: 1,
        exp: '太棒了！促成者 (Facilitator) 的核心精神就是「提問與引導跨單位對話」，讓參演者自己找出權責介面與解決方案。'
      }
    ]
  },
  seniorController: {
    badge: '總控與現場的通訊樞紐',
    clearance: 'SECRET',
    spiritTitle: '確保總控制組 (MCC) 與第一線現場控制官 (VC) 訊息零時差',
    spiritSummary: '進階控制官 (Senior Controller, SC) 駐守於總控制組，狀況下達前需與現場控制官確認場地安全與準備狀態，並精準記錄各場景時序。',
    goldenRules: [
      '下達前雙重確認 (Go / No-Go)：確認現場控制官回報該區參演者已就位且無安全顧慮。',
      '即時追蹤場景時序：記錄各分區狀況下達與完成的實際時間，提供總控制官判斷進度。',
      '防止跨場景資訊錯亂：在多場地演練中確保各分區時間軸同步。'
    ],
    tasks: [
      { phase: '演前準備', text: '測試總控制組與所有現場控制官 (VC) 之無線電與通訊軟體連線品質。' },
      { phase: '演練當日', text: '依時序向各場景現場控制官確認是否準備接收狀況下達，並回報 MSEL 管理者。' },
      { phase: '演練當日', text: '彙整各場景回報之異常狀況或安全事件，即時呈報總控制官與安全官。' }
    ],
    quiz: [
      {
        q: '到了 MSEL 預定的 10:15 準備下達「餘震警報」，但現場控制官回報走廊剛好有真實民眾經過。身為進階控制官 (SC) 應如何處理？',
        options: [
          '時間到了就一定要準時下達，叫現場控制官直接吹哨',
          '暫緩該區下達，請現場控制官先清空走廊確保安全後回報，再通知 MSEL 管理者啟動下達',
          '自己拿大聲公對走廊喊話'
        ],
        ans: 1,
        exp: '正確！進階控制官的職責就是確認現場控制官已準備就緒且環境安全後，才啟動狀況注入。'
      }
    ]
  },
  mselManager: {
    badge: '劇本時序與注入精準管控',
    clearance: 'SECRET',
    spiritTitle: '掌控主境況事件清單 (MSEL) 的執行節拍，讓劇本活起來',
    spiritSummary: 'MSEL 管理者 (MM) 相當於演習場景的執行導演，依據時間軸與觸發條件通知現場控制官與模擬小組執行狀況注入。',
    goldenRules: [
      '兼顧時間觸發與條件觸發：有些狀況需等前一個動作完成才能下達，不可死板照表操課。',
      '精準調度模擬小組 (SimCell)：提前 3~5 分鐘通知模擬小組準備撥打模擬電話或派出傷患演員。',
      '即時標註變更紀錄：若因時間因素跳過或合併某張狀況卡，務必在總表註記供評估員參考。'
    ],
    tasks: [
      { phase: '演前準備', text: '完成最終版 MSEL 狀況卡編碼、時間軸檢核與通報媒介確認。' },
      { phase: '演練當日', text: '駐守總控制組，依序通知各場景控制官與模擬小組執行狀況注入。' },
      { phase: '演練當日', text: '當參演者遺漏關鍵驗證項目時，建議總控制官啟動「應急引導狀況」。' }
    ],
    quiz: [
      {
        q: '當參演人員處置速度非常快，提前 10 分鐘完成了第一階段疏散，此時 MSEL 管理者應該怎麼做？',
        options: [
          '讓全場參演人員原地發呆乾等 10 分鐘，直到手錶走到預定時間',
          '與進階控制官及總控制官確認各區就緒後，提前進入下一波狀況下達，維持演練緊湊感',
          '直接宣布演習提前結束解散'
        ],
        ans: 1,
        exp: '正確！MSEL 是活的腳本，應依據參演者的實際處置進度動態調整下達時機。'
      }
    ]
  },
  venueControllers: {
    badge: '第一線狀況注入與現場把關',
    clearance: 'SECRET',
    spiritTitle: '做參演者的「眼睛與耳朵」，只提供情境資訊、絕不教導怎麼做',
    spiritSummary: '現場控制官 (Venue Controller, VC) 派駐在第一線各個災點，透過口頭描述、字條或指揮演員讓參演者感受現場壓力，嚴守「不介入、不提示」。',
    goldenRules: [
      '絕對禁止提示標準答案：看到參演者走錯方向或忘記拿器材，也不可私下提醒。',
      '具體描述感官資訊：例如告知「現在走廊濃煙密布、能見度不到1公尺」，讓參演者據此決策。',
      '與評估員密切配合：下達狀況的瞬間要讓身旁的評估員知道，方便精準計時。',
      '第一線安全守護者：隨時留意地板濕滑、電線絆倒或人員推擠風險。'
    ],
    tasks: [
      { phase: '演前準備', text: '勘查負責的責任區場地，確認造煙點、道具擺設與模擬演員就位位置。' },
      { phase: '演練當日', text: '接收 MSEL 管理者指令後，向該區參演者下達突發狀況並回報進階控制官。' },
      { phase: '演練當日', text: '管理該區域的臨演進場時機，確保演練結束後人員與道具安全撤離。' }
    ],
    quiz: [
      {
        q: '您在 5 樓病房擔任現場控制官，看到護理人員在疏散時忘記關閉防火門，評估員正在旁邊記錄。此時您應該？',
        options: [
          '立刻走過去幫他們把防火門關起來，並小聲說「記得要關門喔」',
          '保持沉默不干涉，讓這個真實疏漏被評估員客觀記錄下來',
          '大聲喊停並當場重新演練一次'
        ],
        ans: 1,
        exp: '完全正確！控制官若出手幫忙或提醒，就會掩蓋掉平時訓練的盲點，使演習失去驗證價值。'
      }
    ]
  },
  simCellLead: {
    badge: '逼真模擬與演員導演',
    clearance: 'SECRET',
    spiritTitle: '扮演未參演的外部世界，用專業演技與症狀卡創造沉浸感',
    spiritSummary: '模擬小組 (Simulation Cell) 負責模擬所有「未實際到場的外部單位」（如 119 勤務中心、台電、家屬電話）及管理現場傷患演員。',
    goldenRules: [
      '臨演必須嚴格依「症狀卡 (Symptomatology Card)」演出：不可隨意加戲或誇大病情。',
      '演員安全與保暖第一：躺在地上或輪椅上的傷患演員，需注意場地溫度與軟墊防護。',
      '模擬電話通報須專業逼真：接聽模擬報案電話時依預設腳本回應，測試參演者通報要素。'
    ],
    tasks: [
      { phase: '演前準備', text: '主持「演員事前簡報」，發放識別背心與 HSEEP 傷患症狀卡並指導演技。' },
      { phase: '演練當日', text: '依 MSEL 時序分批引導傷患演員或躁動民眾進入演練區域。' },
      { phase: '演練當日', text: '操作模擬電話/通訊軟體，代表未參演單位與參演者進行真實互動。' }
    ],
    quiz: [
      {
        q: '在演員事前簡報中，發給傷患臨演的「症狀卡 (Symptomatology Card)」最主要的作用是什麼？',
        options: [
          '讓演員自由發揮，看誰演得最像電影明星',
          '提供統一的生命徵象數值、臨床症狀與行為指示，讓救護人員能進行客觀的檢傷分類與處置',
          '用來當作演練結束後的便當兌換券'
        ],
        ans: 1,
        exp: '正確！症狀卡能確保臨床救護評估的標準化，讓醫護人員根據卡片上的數據做出正確醫療決策。'
      }
    ]
  },
  leadEvaluator: {
    badge: '評估標準統一與 AAR 總編',
    clearance: 'SECRET',
    spiritTitle: '對照「計畫與 SOP」客觀評核，從表象失誤挖掘系統性根源',
    spiritSummary: '首席評估員負責訓練所有現場評估員統一 P / S / M / U 評級標準，並在演練後主導 5Why 根本原因分析，產出事件後報告 (AAR/IP)。',
    goldenRules: [
      '評估依據是「計畫與 SOP」，不是個人主觀喜好。',
      '執行「不歸責個人 (Non-attribution)」紀錄：報告中只寫職稱與單位，不點名批判特定個人。',
      '運用 5Why 追問根本原因：看到「超時」或「漏做」只是表面現象，必須追問背後的制度或訓練原因。'
    ],
    tasks: [
      { phase: '演前規劃', text: '依據演習目標與核心能力，制定演習評估指南 (EEG) 與觀察紀錄表。' },
      { phase: '演前規劃', text: '召開評估小組會議，統一 P / S / M / U 評級尺度並分配責任區。' },
      { phase: '演練當日', text: '巡視各區評估員紀錄狀況，確保重要時間節點皆有精準計時。' },
      { phase: '演後精進', text: '彙整 Hotwash 與所有紀錄表，主持事件後會議並完成 AAR/IP 報告。' }
    ],
    quiz: [
      {
        q: '在撰寫事件後報告 (AAR) 時，下列哪一種寫法最符合 T-DEEP 與 HSEEP 的「不歸責個人」專業規範？',
        options: [
          '「陳大明專員忘記帶無線電導致通報延誤，建議懲處。」',
          '「10:05 現場聯絡員因未攜帶備用無線電，導致通訊中斷 4 分鐘；經查係因交接清點表未列入無線電檢查項目。」',
          '「大家表現都很棒，沒有任何問題。」'
        ],
        ans: 1,
        exp: '完全正確！聚焦於「角色職稱、具體時間影響」以及背後的「制度/清點表缺口」，才能真正推動組織進步。'
      }
    ]
  },
  evaluators: {
    badge: '第一線客觀觀察與計時紀錄',
    clearance: 'SECRET',
    spiritTitle: '做透明的「攝影機與碼錶」，只記錄事實、不干涉演練',
    spiritSummary: '現場評估員緊跟在負責的參演編組旁，精準記下「幾分幾秒做了什麼決定、遇到了什麼困難」，並對照 MSEL 預期處置作為進行客觀評核。',
    goldenRules: [
      '禁止干預或給建議：演練進行中絕對不可問參演者「你確定要這樣做嗎？」或給暗示。',
      '時間點與數據要精準：記錄狀況下達時間、開始行動時間與任務完成時間。',
      '同時記錄「優點」與「待改善事項」：做得好的創新做法也要詳實記錄。',
      '演後立刻整理筆記：趁記憶猶新時完成 P/S/M/U 評級勾選。'
    ],
    tasks: [
      { phase: '演前準備', text: '熟讀《控制官與評估者手冊》，掌握負責驗證的演習目標與 SOP 標準。' },
      { phase: '演練當日', text: '隨身攜帶碼錶、紀錄板與手冊，於指定位置客觀觀察並記錄關鍵時間軸。' },
      { phase: '演後即時', text: '參與 Hotwash 會議，針對觀察到的關鍵現象提出建設性提問。' },
      { phase: '演後精進', text: '完成觀察評估紀錄表 (P/S/M/U 評級與 5Why 初步分析)，繳交給首席評估員。' }
    ],
    quiz: [
      {
        q: '您看到救護班搬運重傷病患時姿勢不正確，雖然最後把人搬出去了，但過程搖晃且耗時較久。依 T-DEEP 標準應給予哪個評級？',
        options: [
          'P (順利完成) - 反正人有搬出去就好',
          'S (稍遇困難) 或 M (重大挑戰) - 雖達成目標，但過程不順暢或有增加二次傷害風險，應具體記錄並建議加強訓練',
          'U (無法達成) - 只要姿勢不標準就全部算零分'
        ],
        ans: 1,
        exp: '正確！T-DEEP 評級區分 P / S / M / U 就是為了精準反映「有達成但過程有風險或可更有效率」的真實狀態。'
      }
    ]
  },
  playersLead: {
    badge: '第一線實戰應變與決策驗證',
    clearance: 'PLAYER_PUBLIC',
    spiritTitle: '視同真實災害全力應變！演練不是背劇本，而是測試平時的準備',
    spiritSummary: '參演人員 (Players) 是整場演習的主角。請忘掉「演戲」的念頭，完全依據您平時在單位內的職責與 SOP，面對突發狀況做出真實判斷與處置。',
    goldenRules: [
      '視同真實災害操作：需要打電話就真的拿起話筒撥打模擬專線，需要推病床就實際執行（注意安全）。',
      '大聲復誦與雙向確認：在嘈雜的災害現場，下達或接收指令務必大聲復誦確認。',
      '善用現有計畫與器材：不清楚規定時，直接翻閱現場的緊急應變手冊或平面圖。',
      'Hotwash 大膽說真話：演練結束後，把現場遇到的設備難用、動線卡住或通訊死角大聲說出來！'
    ],
    tasks: [
      { phase: '演前準備', text: '參加參演者事前簡報，確認個人識別證、安全規則與緊急停止口令。' },
      { phase: '演前準備', text: '複習本單位緊急應變 SOP、避難路線圖與急救/滅火器材位置。' },
      { phase: '演練當日', text: '依日常職責投入應變，針對控制官與模擬組提供的災情做出即時處置與跨組協調。' },
      { phase: '演後即時', text: '全員參加事件後即時反饋 (Hotwash) 並填寫回饋問卷，分享第一線實戰感受。' }
    ],
    quiz: [
      {
        q: '演習過程中，現場控制官遞給您一張字條寫著：「走廊濃煙密布無法通行，且中央氧氣壓力警報響起」。身為參演人員應該怎麼做？',
        options: [
          '問控制官：「那我現在應該往左邊跑還是往右邊跑？」',
          '立刻將字條內容視為真實災情，依平時訓練的 RACE 與供氧備援 SOP 做出決策並通知團隊執行',
          '因為原本預演沒排這一段，所以假裝沒看到繼續照原本路線走'
        ],
        ans: 1,
        exp: '完全正確！演習的價值就在於面對「非預期狀況」時的臨場應變與 SOP 運用，一切靠團隊專業判斷！'
      }
    ]
  },
  externalPartners: {
    badge: '跨機關聯防與專業支援',
    clearance: 'PLAYER_PUBLIC',
    spiritTitle: '磨合「指揮權交接介面」與「外部資源整合」，建立社區韌性',
    spiritSummary: '外部支援單位（消防、警政、衛生局、里鄰社區）與主題專家 (SME) 的參與，能驗證公私部門的通訊對接、交接簡報效率與資源調度。',
    goldenRules: [
      '聚焦跨組織介面 (Interface)：重點驗證內部應變小組與外部救災指揮體系 (ICS) 的交接順暢度。',
      '驗證動線與集結管制：測試外部救援車輛進入路線、集結區運作與傷患後送分流。',
      '主題專家 (SME) 客觀把關：協助檢視情境設定與參演者處置是否符合最新專業技術標準。'
    ],
    tasks: [
      { phase: '演前規劃', text: '參與協調會議，確認外部單位支援規模、進場時機與通訊聯繫窗口。' },
      { phase: '演練當日', text: '依約定時序進場執行指揮權交接、滅火救援、交通管制或專業觀察記錄。' },
      { phase: '演後精進', text: '參與 Hotwash 與事件後會議，從外部救援視角提供交接簡報與動線改善建議。' }
    ],
    quiz: [
      {
        q: '轄區消防隊抵達災害現場大門時，最關鍵的跨單位協作動作是什麼？',
        options: [
          '直接衝進建築物裡面自己找起火點，不用跟內部人員說話',
          '與場所指揮官進行「3分鐘交接簡報」，掌握起火點、受困人數、已疏散區劃及危險物/氣體遮斷閥位置，並建立統一指揮介面',
          '在門口等所有內部人員都跑出來後再開始動作'
        ],
        ans: 1,
        exp: '正確！內部人員最熟悉建築構造與弱勢者位置，快速精準的交接簡報能大幅提升外部救援效率。'
      }
    ]
  }
};

// --- 7. 空白初始表單狀態 ---
const createEmptyFormData = () => ({
  exerciseName: '',
  exerciseType: '實兵演練 (FSE) - 最複雜之跨單位全尺度演練',
  disasterType: '',
  exerciseDate: '',
  stageAssignments: {
    0: { owner: '', dueDate: '', notes: '' },
    1: { owner: '', dueDate: '', notes: '' },
    2: { owner: '', dueDate: '', notes: '' },
    3: { owner: '', dueDate: '', notes: '' },
    4: { owner: '', dueDate: '', notes: '' },
    5: { owner: '', dueDate: '', notes: '' }
  },
  rolesRoster: {
    director: '',
    teamLead: '',
    safetyOfficer: '',
    designLead: '',
    logisticsLead: '',
    masterController: '',
    seniorController: '',
    mselManager: '',
    venueControllers: '',
    simCellLead: '',
    leadEvaluator: '',
    evaluators: '',
    playersLead: '',
    externalPartners: ''
  },
  objectivesList: [],
  coreCapabilities: '',
  scenarioBackground: '',
  venues: '',
  selectedTactics: [],
  selectedDiseases: [],
  mselList: [],
  logisticsCheck: '',
  evaluations: {}
});

const TDEEPPlanner = () => {
  const [appMode, setAppMode] = useState('PLANNER'); // 'PLANNER' | 'TRAINING'
  const [selectedTrainingRole, setSelectedTrainingRole] = useState('director');
  const [trainingTab, setTrainingTab] = useState('SPIRIT'); // 'SPIRIT' | 'BRIEF' | 'QUIZ'
  const [checkedTasks, setCheckedTasks] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  // 主要表單資料狀態 (支援 localStorage 自動暫存)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('tdeep_planner_v4');
      if (saved) return { ...createEmptyFormData(), ...JSON.parse(saved) };
    } catch (e) {
      // ignore storage errors
    }
    return createEmptyFormData();
  });

  useEffect(() => {
    try {
      localStorage.setItem('tdeep_planner_v4', JSON.stringify(formData));
    } catch (e) {
      // ignore storage errors
    }
  }, [formData]);

  // 輔助 UI 狀態
  const [smartBuilder, setSmartBuilder] = useState({ time: '', who: '', action: '', standard: '' });
  const [showPresetsDrawer, setShowPresetsDrawer] = useState(false);
  const [presetTab, setPresetTab] = useState('FIRE');
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // --- 表單更新與目標管理函式 ---
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateStageAssignment = (stepIdx, field, value) => {
    setFormData(prev => ({
      ...prev,
      stageAssignments: {
        ...prev.stageAssignments,
        [stepIdx]: { ...(prev.stageAssignments?.[stepIdx] || {}), [field]: value }
      }
    }));
  };

  const updateRoleRoster = (roleKey, value) => {
    setFormData(prev => ({
      ...prev,
      rolesRoster: { ...(prev.rolesRoster || {}), [roleKey]: value }
    }));
  };

  const addObjective = (text) => {
    if (!text.trim()) return;
    const newId = 'obj_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    setFormData(prev => ({
      ...prev,
      objectivesList: [...prev.objectivesList, { id: newId, text: text.trim() }]
    }));
  };

  const updateObjectiveText = (id, text) => {
    setFormData(prev => ({
      ...prev,
      objectivesList: prev.objectivesList.map(o => (o.id === id ? { ...o, text } : o))
    }));
  };

  const removeObjective = (id) => {
    setFormData(prev => ({
      ...prev,
      objectivesList: prev.objectivesList.filter(o => o.id !== id)
    }));
  };

  const addFromSmartBuilder = () => {
    const { time, who, standard, action } = smartBuilder;
    if (!action.trim()) {
      showToast('⚠️ 請至少填寫第 4 項「可量化之關鍵任務」');
      return;
    }
    const sentence = `於${time || '災後指定時間'}，由${who || '應變編組'}依${standard || '現行緊急應變SOP'}，完成${action}。`;
    addObjective(sentence);
    setSmartBuilder({ time: '', who: '', action: '', standard: '' });
    showToast('✅ 已組合並新增 SMART 演習目標！');
  };

  // --- 戰術與傷病模組勾選及轉為 MSEL ---
  const toggleSelection = (listKey, itemId) => {
    setFormData(prev => {
      const current = prev[listKey] || [];
      const exists = current.includes(itemId);
      return {
        ...prev,
        [listKey]: exists ? current.filter(id => id !== itemId) : [...current, itemId]
      };
    });
  };

  const generateMselFromSelections = () => {
    const tactics = FIRE_TACTICS_DATA.filter(t => (formData.selectedTactics || []).includes(t.id));
    const diseases = EMS_DISEASES_DATA.filter(d => (formData.selectedDiseases || []).includes(d.id));
    if (tactics.length === 0 && diseases.length === 0) {
      showToast('⚠️ 請先勾選至少一項消防戰術或救護疾病模組！');
      return;
    }
    const defaultObjId = formData.objectivesList[0]?.id || '';
    const defaultEval = formData.rolesRoster?.evaluators || '';
    const newItems = [
      ...tactics.map((t, idx) => ({
        time: `+${(idx + 1) * 5} 分鐘`,
        injectType: '一般狀況 (Inject)',
        sender: '現場控制官 (VC)',
        receiver: '自衛消防編組 / 消防指揮官',
        targetObjId: defaultObjId,
        evaluatorName: defaultEval,
        event: `【${t.title}】${t.event}`,
        expectedAction: t.action
      })),
      ...diseases.map((d, idx) => ({
        time: `+${(tactics.length + idx + 1) * 5} 分鐘`,
        injectType: '一般狀況 (Inject)',
        sender: '模擬小組 / 臨演(持症狀卡)',
        receiver: '救護班 / 醫療人員',
        targetObjId: defaultObjId,
        evaluatorName: defaultEval,
        event: `【臨床救護：${d.title}】${d.event}（生命徵象：${d.vitals}）`,
        expectedAction: d.action
      }))
    ];
    setFormData(prev => ({
      ...prev,
      mselList: [...prev.mselList, ...newItems]
    }));
    showToast(`🪄 已將 ${newItems.length} 筆戰術與傷病狀況加入第四階段 MSEL！`);
  };

  // --- MSEL 狀況卡操作 ---
  const addMsel = (presetEvent = '', presetAction = '', presetSender = '現場控制官', presetReceiver = '應變指揮中心') => {
    const defaultObjId = formData.objectivesList[0]?.id || '';
    setFormData(prev => ({
      ...prev,
      mselList: [
        ...prev.mselList,
        {
          time: '',
          injectType: '一般狀況 (Inject)',
          sender: presetSender,
          receiver: presetReceiver,
          targetObjId: defaultObjId,
          evaluatorName: prev.rolesRoster?.evaluators || '',
          event: presetEvent,
          expectedAction: presetAction
        }
      ]
    }));
    if (presetEvent) showToast('✅ 已將實戰狀況加入 MSEL 清單！');
  };

  const updateMsel = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      mselList: prev.mselList.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    }));
  };

  const removeMsel = (index) => {
    setFormData(prev => ({
      ...prev,
      mselList: prev.mselList.filter((_, idx) => idx !== index)
    }));
  };

  // --- 評估表更新 ---
  const updateEval = (objId, field, value) => {
    setFormData(prev => ({
      ...prev,
      evaluations: {
        ...prev.evaluations,
        [objId]: {
          rating: 'P',
          evaluatorName: prev.rolesRoster?.leadEvaluator || '',
          observation: '',
          rootCause: '',
          poete: '訓練 (Training)',
          correctiveAction: '',
          actionOwner: '',
          actionDueDate: '',
          ...(prev.evaluations?.[objId] || {}),
          [field]: value
        }
      }
    }));
  };

  // --- 三大實戰範例載入與清空／備份 ---
  const loadICUScenario = () => {
    setFormData({
      exerciseName: '臺北市立聯合醫院加護病房(ICU)夜間火災應變實兵演練',
      exerciseType: '實兵演練 (FSE) - 最複雜之跨單位全尺度演練',
      disasterType: '醫療機構夜間火災併發維生氣體中斷',
      exerciseDate: '115年11月20日 凌晨 02:00 - 03:30',
      stageAssignments: {
        0: { owner: '陳建宏 副院長', dueDate: '115/10/01', notes: '確立夜間最小人力驗證原則' },
        1: { owner: '林佳穎 護理部督導', dueDate: '115/10/12', notes: '訂定水平避難優先指標' },
        2: { owner: '張志豪 職安室主任', dueDate: '115/10/25', notes: '完成5樓加護中心動線勘查' },
        3: { owner: '王美玲 急診護理長', dueDate: '115/11/05', notes: '設計酸素中斷與呼吸器切換狀況' },
        4: { owner: '張志豪 職安室主任', dueDate: '115/11/15', notes: '確認發煙機與安全中止口令' },
        5: { owner: '李明哲 醫務秘書', dueDate: '115/11/25', notes: '彙整AAR報告呈報院長室' }
      },
      rolesRoster: {
        director: '陳建宏 副院長',
        teamLead: '林佳穎 護理部督導',
        safetyOfficer: '張志豪 職安室主任',
        designLead: '王美玲 急診護理長',
        logisticsLead: '黃俊傑 總務室組長',
        masterController: '李明哲 醫務秘書',
        seniorController: '周雅婷 專員',
        mselManager: '吳宗憲 護理師',
        venueControllers: '趙國強 組長、劉怡君 副護理長',
        simCellLead: '蔡佩珊 教學部專員',
        leadEvaluator: '郭文雄 消防局退休大隊長(外聘SME)',
        evaluators: '鄭淑芬 督導、許家豪 呼吸治療組長',
        playersLead: '夜間值班ICU護理長及當班醫護共7員',
        externalPartners: '臺北市政府消防局轄區分隊'
      },
      objectivesList: [
        { id: 'icu_1', text: '於火警發生後 3 分鐘內，由夜班護理人員依 RACE 原則完成初期通報、初期滅火及防火門關閉阻絕濃煙。' },
        { id: 'icu_2', text: '於中央氧氣警報響起 5 分鐘內，由呼吸治療師與護理師完成 6 名呼吸器依賴重症病患之攜帶式氧氣鋼瓶切換。' },
        { id: 'icu_3', text: '於災後 12 分鐘內，完成起火區劃重症病患「連床帶人」水平疏散至鄰接獨立防火區劃，並與轄區消防隊完成 3 分鐘交接簡報。' }
      ],
      coreCapabilities: '1. 夜間有限人力應變調度 2. 維生設備不斷電與供氧切換 3. 避難弱者水平疏散 4. 院內HICS與警消ICS指揮交接',
      scenarioBackground: '凌晨 02:05，加護病房庫房除濕機電線走火引發濃煙，當時病房僅有夜班人力 7 名（醫師1、護理師4、呼吸治療師1、書記1），收治 8 名重症病患（其中 6 名使用呼吸器）。',
      venues: '1. 主災區：5樓A區加護病房 2. 水平避難安置區：5樓B區恢復室（獨立防火區劃） 3. 外部支援集結點：4樓安全梯前廳 4. 消防交接點：1樓急診大門警衛室',
      selectedTactics: ['ft_spread', 'ft_gas'],
      selectedDiseases: ['ems_vent', 'ems_inhal'],
      mselList: [
        { time: '02:05', injectType: '一般狀況 (Inject)', sender: '模擬小組(啟動發煙機)', receiver: 'ICU夜班護理站', targetObjId: 'icu_1', evaluatorName: '鄭淑芬 督導', event: '庫房竄出濃煙並觸發火警受信總機，走廊能見度迅速下降。', expectedAction: '立即執行 RACE：救出鄰近病患、啟動通報 9999、嘗試滅火器初期滅火、關閉庫房與區劃防火門。' },
        { time: '02:09', injectType: '一般狀況 (Inject)', sender: '現場控制官 (VC)', receiver: '呼吸治療師與工務值班', targetObjId: 'icu_2', evaluatorName: '許家豪 呼吸治療組長', event: '高溫導致該區醫用氧氣支管壓力驟降，多床呼吸器發出低壓高音警報。', expectedAction: '工務關閉A區氧氣區域閥箱；醫護立即切換 E 型攜帶式氧氣鋼瓶及手動甦醒球維持通氣。' },
        { time: '02:14', injectType: '應急引導狀況 (Contingency Inject)', sender: '現場控制官 (VC)', receiver: '夜間支援人力(護理長)', targetObjId: 'icu_3', evaluatorName: '鄭淑芬 督導', event: '其他樓層支援人員直接衝上 5 樓 A 區門口造成走道壅塞。', expectedAction: '現場指揮官喝止逆向湧入，改導引支援人力至 5 樓 B 區安全側接應病床水平推入。' }
      ],
      logisticsCheck: '1. 確認發煙機為無毒水性煙霧，並預先通知119勤務中心及全院廣播「此為演習」。\n2. 緊急停止口令：「真實意外，停止演習」。\n3. 參演人員配戴綠色識別臂章，控制/評估人員穿紅色背心，貴賓限於B區觀察線後方。',
      evaluations: {
        icu_1: { rating: 'P', evaluatorName: '鄭淑芬 督導', observation: '夜班人員於 1 分 40 秒內完成通報並確實關閉防火門，有效阻絕濃煙擴散。', rootCause: '', poete: '訓練 (Training)', correctiveAction: '持續維持夜班新進人員每季消防通報演練。', actionOwner: '林佳穎 督導', actionDueDate: '115/12/31' },
        icu_2: { rating: 'S', evaluatorName: '許家豪 呼吸治療組長', observation: '6 床皆完成氧氣鋼瓶切換，但第 5 床因備用鋼瓶推車輪鎖卡住延誤 90 秒。', rootCause: '推車輪煞車長期未上油保養，且夜班人員不熟悉腳踏解鎖位置。', poete: '裝備 (Equipment)', correctiveAction: '全面檢修各病房備用氧氣鋼瓶推車輪鎖，並於推車把手貼附螢光解鎖標示。', actionOwner: '黃俊傑 組長', actionDueDate: '115/12/15' }
      }
    });
    setCurrentStep(0);
    setAppMode('PLANNER');
    showToast('🏥 已載入「範例一：醫院加護病房火災」完整規劃！');
  };

  const loadKTVScenario = () => {
    setFormData({
      exerciseName: '臺北市信義區高層複合式商業大樓(KTV與百貨商場)火災演練',
      exerciseType: '實兵演練 (FSE) - 最複雜之跨單位全尺度演練',
      disasterType: '高層複合用途建築物暗室火災與大規模群眾疏散',
      exerciseDate: '115年12月05日 下午 14:30 - 16:30',
      stageAssignments: {
        0: { owner: '劉大偉 大樓管委會主委', dueDate: '115/10/15', notes: '整合KTV與百貨兩大業態' },
        1: { owner: '陳雅雯 防災中心主任', dueDate: '115/10/28', notes: '訂定雙業態聯防目標' },
        2: { owner: '林志明 消防設備師', dueDate: '115/11/10', notes: '勘查8樓KTV暗室與6樓商場連通梯' },
        3: { owner: '張凱文 安全經理', dueDate: '115/11/20', notes: '設計包廂受困與濃煙中毒狀況' },
        4: { owner: '陳雅雯 防災中心主任', dueDate: '115/12/01', notes: '確認商場營業時間動線管制' },
        5: { owner: '劉大偉 主委', dueDate: '115/12/15', notes: '提交消防局備查與改善追蹤' }
      },
      rolesRoster: {
        director: '劉大偉 大樓管委會主委',
        teamLead: '陳雅雯 防災中心主任',
        safetyOfficer: '林志明 消防設備師',
        designLead: '張凱文 安全經理',
        logisticsLead: '吳佳蓉 行政副理',
        masterController: '王建國 顧問(前消防局科長)',
        seniorController: '李冠宇 副理',
        mselManager: '黃诗涵 專員',
        venueControllers: '8樓KTV組：周志強、6樓商場組：林佩君',
        simCellLead: '徐明德 客服主任(帶領臨演15名)',
        leadEvaluator: '蔡宗翰 火災學專家',
        evaluators: '鄭文華 技師、陳怡如 護理師',
        playersLead: 'KTV自衛消防編組12員、百貨商場編組10員',
        externalPartners: '消防局雲梯車分隊、轄區派出所、衛生局大傷隊'
      },
      objectivesList: [
        { id: 'ktv_1', text: '於 8 樓 KTV 包廂火警觸發後 2 分鐘內，完成全區包廂影音系統強制切斷、緊急照明點亮及分層火警廣播。' },
        { id: 'ktv_2', text: '於災後 8 分鐘內，完成 8 樓 KTV 消費民眾與 6~7 樓百貨商場顧客分流疏散至 1 樓戶外集結區，避免安全梯口推擠。' },
        { id: 'ktv_3', text: '於消防隊抵達後 3 分鐘內，由大樓防災中心向現場指揮官完成跨業態人員清點簡報，並配合執行雲梯車高空搜救與濃煙中毒救護。' }
      ],
      coreCapabilities: '1. 暗室娛樂場所強制切電與引導 2. 複合用途建築垂直防火區劃管理 3. 雲梯車外圍人命搜救配合 4. 大量傷病患檢傷與毒氣中毒處置',
      scenarioBackground: '週五下午尖峰時段，15層樓複合式大樓之 8 樓 KTV 機房電氣走火，濃煙沿空調管道蔓延至走道；同時 6~7 樓百貨週年慶有大量人潮，部分包廂顧客因飲酒反應遲緩。',
      venues: '1. 起火層：8樓KTV大廳與805包廂 2. 連通受影響層：7樓百貨餐飲區 3. 1樓防災中心與戶外雲梯車操作區 4. 1樓廣場檢傷後送站',
      selectedTactics: ['ft_hose', 'ft_spread', 'ft_rit'],
      selectedDiseases: ['ems_inhal', 'ems_co'],
      mselList: [
        { time: '14:30', injectType: '一般狀況 (Inject)', sender: '現場控制官 (VC)', receiver: '8樓KTV櫃台與1樓防災中心', targetObjId: 'ktv_1', evaluatorName: '鄭文華 技師', event: '805包廂後方機房起火冒煙，包廂內音樂聲極大，顧客未察覺火警。', expectedAction: '防災中心確認火警訊號後，立即啟動連鎖控制切斷所有包廂影音電源、開啟緊急照明並進行緊急廣播。' },
        { time: '14:35', injectType: '一般狀況 (Inject)', sender: '模擬小組(臨演3名)', receiver: '8樓避難引導班', targetObjId: 'ktv_2', evaluatorName: '鄭文華 技師', event: '808包廂內有 2 名醉酒顧客意識模糊倒臥沙發，另有 1 名民眾試圖搭乘電梯逃生。', expectedAction: '引導班勸阻搭乘電梯並管制電梯迫降1樓；2人一組協助攙扶醉酒顧客由特別安全梯撤離，並於包廂門貼上「已清查」標記。' },
        { time: '14:42', injectType: '一般狀況 (Inject)', sender: '臨演(持症狀卡)', receiver: '消防救護隊與1樓檢傷站', targetObjId: 'ktv_3', evaluatorName: '陳怡如 護理師', event: '雲梯車自 8 樓窗台救出 1 名濃煙吸入患者，脈搏血氧顯示 99% 但意識昏迷 (GCS E2V2M4)。', expectedAction: '救護人員識別一氧化碳/氰化物複合中毒（假性血氧正常），立即給予 100% 純氧面罩並優先後送。' }
      ],
      logisticsCheck: '1. 雲梯車操作區（大樓東側道路）提前 1 小時淨空並申請路權交管。\n2. 演練範圍內之營業櫃位張貼演習告示，避免真實顧客恐慌。\n3. 緊急停止口令：「真實意外，停止演習」。',
      evaluations: {
        ktv_1: { rating: 'P', evaluatorName: '鄭文華 技師', observation: '防災中心於 1 分 15 秒內切斷全樓層包廂影音並點亮導引燈，反應極為迅速。', rootCause: '', poete: '計畫 (Planning)', correctiveAction: '將此標準作業時間納入新進員工訓練手冊。', actionOwner: '陳雅雯 主任', actionDueDate: '115/12/31' },
        ktv_2: { rating: 'M', evaluatorName: '鄭文華 技師', observation: '7樓百貨顧客與8樓KTV人潮在 B 安全梯 5 樓轉角處發生嚴重交錯擁擠，延誤疏散 4 分鐘。', rootCause: '兩業態平時各自演練，未協調分流使用 A、B 兩座特別安全梯。', poete: '組織 (Organization)', correctiveAction: '修訂大樓共同防火管理計畫，規定 8 樓以上優先使用 A 安全梯、7 樓以下使用 B 安全梯。', actionOwner: '劉大偉 主委', actionDueDate: '116/01/15' }
      }
    });
    setCurrentStep(0);
    setAppMode('PLANNER');
    showToast('🎤 已載入「範例二：高層KTV與商場火災」完整規劃！');
  };

  const loadZhenxingScenario = () => {
    setFormData({
      exerciseName: '振興醫療財團法人振興醫院複合式災害（地震引發供氧中斷與火災）演練',
      exerciseType: '實兵演練 (FSE) - 最複雜之跨單位全尺度演練',
      disasterType: '震度5強地震引發電力瞬停、中央供氧異常及加護中心電氣火災',
      exerciseDate: '115年11月12日 晚上 18:25 - 20:00',
      stageAssignments: {
        0: { owner: '醫療副院長', dueDate: '115/09/20', notes: '確立跨科室HICS與外援介面' },
        1: { owner: '護理部主任', dueDate: '115/10/05', notes: '訂定水平疏散與供氧應變目標' },
        2: { owner: '工務室主任 / 職安室', dueDate: '115/10/20', notes: '規劃8樓水平避難至第二醫療大樓動線' },
        3: { owner: '急診醫學部主任', dueDate: '115/11/01', notes: '整合加護中心疏散與急診大傷演練' },
        4: { owner: '職安室主任', dueDate: '115/11/08', notes: '確認1號門警消交接盒與動線分流' },
        5: { owner: '品管中心主任', dueDate: '115/11/20', notes: '召開AAM檢討水平疏散與氣體遮斷界限' }
      },
      rolesRoster: {
        director: '醫療副院長',
        teamLead: '護理部主任',
        safetyOfficer: '職業安全衛生室主任',
        designLead: '急診醫學部主治醫師',
        logisticsLead: '工務室與總務室組長',
        masterController: '醫務秘書（總控制官）',
        seniorController: '品管中心專員',
        mselManager: '護理部督導',
        venueControllers: '8樓加護中心控制官、1樓急診大傷控制官',
        simCellLead: '教學部臨床技能中心團隊',
        leadEvaluator: '外部防災專家學者（首席評估員）',
        evaluators: '消防分隊代表、護理督導、工務技師',
        playersLead: '綜合加護中心值班人員9名（醫師1、護理師4、專師1、RT1、護佐1、洗腎護理師1）及急診團隊',
        externalPartners: '臺北市政府消防局（石牌、天母、光明分隊）'
      },
      objectivesList: [
        { id: 'zh_1', text: '於地震後 3 分鐘內，綜合加護中心值班 9 名人員完成自衛消防編組啟動、RACE 應變及通訊切換（桌機故障改撥公務手機 26595）。' },
        { id: 'zh_2', text: '於氣體警報盤發出氧氣壓力不足 5 分鐘內，完成 8 名重症病患（含呼吸衰竭及洗腎患者）之備用氧氣切換與緊急離機撤離。' },
        { id: 'zh_3', text: '於災後 15 分鐘內，嚴守「水平優先於垂直」原則將重症病患撤往同樓層鄰接防火區劃或第二醫療大樓 8 樓，並於 1 號門與石牌分隊完成 3 分鐘交接簡報。' }
      ],
      coreCapabilities: '1. 震後複合災害指揮 (HICS) 2. 供氧中斷與洗腎緊急離機 3. 水平跨棟防火區劃避難 4. 警消 3 分鐘簡報盒交接與大傷動線隔離',
      scenarioBackground: '115年11月12日晚上 18:25，大台北地區發生震度 5 強地震，院區電力瞬停後備援啟動。綜合加護中心多床呼吸器與氣體警報盤發出氧氣壓力不足警報；同時 08 床點滴架輸液管線鬆脫滴落延長線，造成短路起火影響逃生動線。當時病房內工作人員 9 名、重症病人 8 名（含呼吸衰竭與血液透析中患者）。',
      venues: '1. 主災區：第一醫療大樓8樓綜合加護中心 2. 水平避難優先區：同樓層鄰接防火區劃及第二醫療大樓8樓 3. 支援人力集結點：7樓護理站（避免逆向湧入8樓） 4. 1號門警消交接點與急診大量傷患檢傷站',
      selectedTactics: ['ft_spread', 'ft_gas'],
      selectedDiseases: ['ems_vent', 'ems_dialysis'],
      mselList: [
        { time: '18:25', injectType: '一般狀況 (Inject)', sender: '總控制組 (MCC)', receiver: '綜合加護中心全體人員', targetObjId: 'zh_1', evaluatorName: '護理督導', event: '發生5強地震，電力瞬停、08床下方延長線短路起火冒煙，且病房桌機電話系統癱瘓。', expectedAction: '立即執行 RACE 初期滅火與通報，因桌機癱瘓立即改用公務手機優先撥打總機 26595 及值班護理主管 25485，啟動院內 HICS。' },
        { time: '18:28', injectType: '一般狀況 (Inject)', sender: '現場控制官 (VC)', receiver: '呼吸治療師、洗腎護理師及工務室', targetObjId: 'zh_2', evaluatorName: '工務技師', event: '氣體警報盤顯示中央與個別單位氧氣壓力驟降，同時火勢逼近氧氣支管；另有 1 名患者正在進行血液透析。', expectedAction: '1. RT與護理師切換攜帶式氧氣鋼瓶。 2. 洗腎護理師執行「雙夾剪斷法」緊急離機。 3. 工務室判定火勢界限，安全前提下關閉分區氣體閥箱。' },
        { time: '18:35', injectType: '應急引導狀況 (Contingency Inject)', sender: '現場控制官 (VC)', receiver: '自衛消防隊長與支援班', targetObjId: 'zh_3', evaluatorName: '消防分隊代表', event: '火勢擴大無法撲滅，需撤離 8 名重症病患；同時石牌、天母消防分隊抵達 1 號門。', expectedAction: '1. 支援人力先於7樓集結，協助將病患「水平優先」推過防火鐵門至鄰接區劃或第二醫療大樓8樓（非直接搬往2樓）。 2. 自衛消防隊長持「3分鐘簡報盒」於1號門與消防指揮官完成交接。' }
      ],
      logisticsCheck: '1. 嚴格隔離「急診重症動線」、「院內避難動線」與「消防救災動線」。\n2. 備妥 1 號門紙本「3分鐘交接簡報盒」（含平面圖、受困清點表、氣體閥箱位置）。\n3. 緊急停止口令：「真實意外，停止演習」。',
      evaluations: {
        zh_1: { rating: 'P', evaluatorName: '護理督導', observation: '桌機失靈後，護理人員於 45 秒內改以公務手機撥通總機 26595 啟動全院廣播與 HICS。', rootCause: '', poete: '計畫 (Planning)', correctiveAction: '將公務手機速撥碼貼於各護理站無線電話機背面。', actionOwner: '護理部主任', actionDueDate: '115/12/15' },
        zh_3: { rating: 'S', evaluatorName: '消防分隊代表', observation: '水平疏散至第二醫療大樓8樓過程順暢，但 1 號門交接時因急診大傷家屬聚集，警衛拉設警戒線稍慢 2 分鐘。', rootCause: '大傷啟動初期警衛人力同時兼顧指揮車引導與警戒線拉設，人手調度重疊。', poete: '組織 (Organization)', correctiveAction: '修訂警衛班緊急編組，明確指定專人負責1號門與急診通道實體隔離警戒。', actionOwner: '總務室主任', actionDueDate: '115/12/31' }
      }
    });
    setCurrentStep(0);
    setAppMode('PLANNER');
    showToast('🚨 已載入「範例三：振興醫院複合災害演練」完整規劃！');
  };

  const executeClearForm = () => {
    setFormData(createEmptyFormData());
    setConfirmClear(false);
    setCurrentStep(0);
    showToast('🧹 已清空所有內容，您可以開始全新的演習規劃！');
  };

  const saveProjectJson = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.exerciseName || 'TDEEP_演習專案備份'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 已下載 JSON 專案備份檔！');
  };

  const loadProjectJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        setFormData({ ...createEmptyFormData(), ...parsed });
        showToast('📂 成功載入專案備份檔！');
      } catch (err) {
        showToast('❌ 檔案格式錯誤，請選擇正確的 JSON 備份檔。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- 防呆檢查：偵測尚未被 MSEL 覆蓋的目標 ---
  const coveredObjIds = new Set(formData.mselList.map(m => m.targetObjId).filter(Boolean));
  const uncoveredObjectives = formData.objectivesList.filter(o => !coveredObjIds.has(o.id));

  // --- 偵測「球員兼裁判」衝突 (控制/評估組 vs 參演人員) ---
  const detectRoleConflict = () => {
    const r = formData.rolesRoster || {};
    const controlText = [r.masterController, r.seniorController, r.mselManager, r.venueControllers, r.leadEvaluator, r.evaluators].join(' ');
    const playerText = r.playersLead || '';
    if (!controlText.trim() || !playerText.trim()) return null;
    const playerTokens = playerText.split(/[\s,、，；;：:()（）]+/).filter(t => t.length >= 2);
    const conflicts = playerTokens.filter(token => controlText.includes(token));
    return conflicts.length > 0 ? [...new Set(conflicts)].join('、') : null;
  };

  // --- 匯出四大正式公文 HTML 報告 ---
  const exportDocument = (docType) => {
    const title = formData.exerciseName || '災害防救演習';
    let fileName = '';
    let bodyHtml = '';

    // 產生人員權責表 HTML
    const rosterRows = ROLE_CATEGORIES.map(cat =>
      cat.roles.map(role => `
        <tr>
          <td style="background:#f8fafc; font-weight:bold; width:35%;">${role.label}</td>
          <td style="color:#1e3a8a; font-weight:bold;">${formData.rolesRoster?.[role.key] || '（未填寫）'}</td>
        </tr>
      `).join('')
    ).join('');

    if (docType === 'PLAN') {
      fileName = `${title}_總規劃書暨AAR評估報告.html`;
      const objRows = formData.objectivesList.map((o, idx) => {
        const ev = formData.evaluations?.[o.id] || {};
        return `
          <tr>
            <td style="text-align:center; font-weight:bold;">目標 ${idx + 1}</td>
            <td>${o.text}</td>
            <td style="text-align:center; font-weight:bold;">${ev.rating || '待評核'}</td>
            <td>${ev.observation || '尚未填寫'}</td>
            <td>${ev.rootCause ? `<strong>[5Why]</strong> ${ev.rootCause}<br/>` : ''}<strong>[${ev.poete || '改善'}]</strong> ${ev.correctiveAction || '無'}<br/><span style="color:#065f46; font-size:0.9em;">主責：${ev.actionOwner || '未定'} ｜ 期限：${ev.actionDueDate || '未定'}</span></td>
          </tr>
        `;
      }).join('');

      const mselRows = formData.mselList.map((m, idx) => `
        <tr>
          <td style="text-align:center;">#${idx + 1}</td>
          <td style="text-align:center; font-weight:bold;">${m.time || '-'}</td>
          <td>${m.injectType || '一般狀況'}</td>
          <td>${m.sender} → ${m.receiver}</td>
          <td>${m.event}</td>
          <td>${m.expectedAction}</td>
          <td>${m.evaluatorName || '-'}</td>
        </tr>
      `).join('');

      bodyHtml = `
        <h1>${title}<br/><span style="font-size:0.65em; color:#475569;">演習規劃書暨事件後評估精進報告 (Plan & AAR/IP)</span></h1>
        <h2>壹、演習基本資料與範疇 (Scope)</h2>
        <table>
          <tr><th style="width:20%; background:#f1f5f9;">演習種類</th><td>${formData.exerciseType}</td><th style="width:20%; background:#f1f5f9;">災害類別</th><td>${formData.disasterType || '-'}</td></tr>
          <tr><th style="background:#f1f5f9;">演習日期時間</th><td colspan="3">${formData.exerciseDate || '-'}</td></tr>
          <tr><th style="background:#f1f5f9;">核心能力要求</th><td colspan="3">${formData.coreCapabilities || '-'}</td></tr>
          <tr><th style="background:#f1f5f9;">情境實況背景</th><td colspan="3">${formData.scenarioBackground || '-'}</td></tr>
          <tr><th style="background:#f1f5f9;">場地與動線規劃</th><td colspan="3">${formData.venues || '-'}</td></tr>
        </table>
        <h2>貳、演習組織架構與人員權責名冊</h2>
        <table><tbody>${rosterRows}</tbody></table>
        <h2>參、主境況事件清單 (MSEL)</h2>
        <table>
          <thead><tr style="background:#1e3a8a; color:white;"><th>編號</th><th>時間</th><th>類型</th><th>通報流向</th><th>狀況內容</th><th>預期處置作為</th><th>負責評估員</th></tr></thead>
          <tbody>${mselRows || '<tr><td colspan="7" style="text-align:center;">無資料</td></tr>'}</tbody>
        </table>
        <h2>肆、演習目標評估與精進改善計畫 (EEG & AAR/IP)</h2>
        <table>
          <thead><tr style="background:#1e3a8a; color:white;"><th>編號</th><th>演習目標</th><th>評級</th><th>客觀觀察紀錄</th><th>5Why 根因與 SMART 精進措施</th></tr></thead>
          <tbody>${objRows || '<tr><td colspan="5" style="text-align:center;">無資料</td></tr>'}</tbody>
        </table>
      `;
    } else if (docType === 'CE_HANDBOOK') {
      fileName = `${title}_控制官與評估者機密手冊.html`;
      const mselCards = formData.mselList.map((m, idx) => `
        <div style="border:2px solid #991b1b; border-radius:8px; padding:12px; margin-bottom:14px; page-break-inside:avoid;">
          <div style="background:#991b1b; color:white; padding:6px 10px; font-weight:bold; display:flex; justify-content:space-between;">
            <span>Inject #${idx + 1} ｜ 預定時間：${m.time || '依指令'} ｜ ${m.injectType || '一般狀況'}</span>
            <span>指派評估員：${m.evaluatorName || '未指定'}</span>
          </div>
          <p><strong>通報流向：</strong>${m.sender} ➔ ${m.receiver}</p>
          <p><strong>狀況訊息內容：</strong>${m.event}</p>
          <p style="background:#ecfdf5; padding:8px; border-left:4px solid #059669;"><strong>預期處置基準：</strong>${m.expectedAction}</p>
          <p style="border-top:1px dashed #cbd5e1; padding-top:8px; color:#475569;">
            實際下達時間：____:____ ｜ 處置完成時間：____:____ ｜ 評級勾選：□ P(順利)  □ S(稍遇困難)  □ M(重大挑戰)  □ U(無法達成)
          </p>
        </div>
      `).join('');

      bodyHtml = `
        <div style="background:#fef2f2; border:2px solid #dc2626; color:#991b1b; padding:10px; text-align:center; font-weight:bold; margin-bottom:15px;">
          🔒 機密文件 (FOR OFFICIAL USE ONLY) — 僅限控制官與評估員持有，嚴禁提前洩漏予參演人員
        </div>
        <h1>${title}<br/><span style="font-size:0.65em; color:#475569;">控制官與評估者手冊 (Controller / Evaluator Handbook)</span></h1>
        <h2>壹、安全與控制紀律</h2>
        <p><strong>緊急停止口令：</strong>如遇真實人員受傷或設備危害，立即高喊「<strong>真實意外，停止演習</strong>」。</p>
        <p><strong>後勤與安全確認事項：</strong>${formData.logisticsCheck || '依現場安全官指示辦理'}</p>
        <h2>貳、狀況注入與現場計時評核卡</h2>
        ${mselCards || '<p>尚未建立 MSEL 狀況卡</p>'}
      `;
    } else if (docType === 'SYMPTOM_CARDS') {
      fileName = `${title}_HSEEP傷患與疾病症狀卡.html`;
      const selected = EMS_DISEASES_DATA.filter(d => (formData.selectedDiseases || []).includes(d.id));
      const cardsList = (selected.length > 0 ? selected : EMS_DISEASES_DATA).map((d, idx) => `
        <div style="border:2px solid #be123c; border-radius:10px; padding:15px; margin-bottom:16px; page-break-inside:avoid;">
          <div style="background:#be123c; color:white; padding:8px 12px; font-weight:bold; font-size:1.1em;">
            🪪 傷患症狀卡 #${idx + 1}：${d.title} （建議檢傷分類：${d.tag}）
          </div>
          <table style="margin-top:10px;">
            <tr><th style="width:22%; background:#fff1f2;">生命徵象數據</th><td style="font-weight:bold; color:#be123c;">${d.vitals}</td></tr>
            <tr><th style="background:#fff1f2;">臨床症狀表現</th><td>${d.symptoms}</td></tr>
            <tr><th style="background:#fff1f2;">🎭 臨演演技指示</th><td style="background:#fefce8;">${d.actingHint}</td></tr>
            <tr><th style="background:#fff1f2;">🩺 救護處置基準</th><td style="background:#ecfdf5;">${d.action}</td></tr>
          </table>
        </div>
      `).join('');

      bodyHtml = `
        <h1>${title}<br/><span style="font-size:0.65em; color:#475569;">HSEEP 標準傷患與疾病症狀卡 (Symptomatology Cards)</span></h1>
        <p style="color:#475569; text-align:center;">供模擬小組發放予傷患臨演或懸掛於模擬假人身上，作為檢傷分類與救護處置依據。</p>
        ${cardsList}
      `;
    } else if (docType === 'HOTWASH') {
      fileName = `${title}_事件後即時反饋Hotwash問卷.html`;
      bodyHtml = `
        <h1>${title}<br/><span style="font-size:0.65em; color:#475569;">事件後即時反饋 (Hotwash) 參與者意見調查表</span></h1>
        <p><strong>填寫說明：</strong>本問卷依《臺北市 T-DEEP 指引》附件 5 設計，採「無責備學習」原則，請於演練結束後 30 分鐘內填寫繳回，作為精進防災計畫之重要依據。</p>
        <table>
          <tr><th style="width:25%; background:#f1f5f9;">1. 您的演習角色</th><td>□ 參演人員   □ 控制官／促成者   □ 評估員   □ 模擬小組   □ 觀察員</td></tr>
          <tr><th style="background:#f1f5f9;">2. 負責／所在場景</th><td style="height:35px;"></td></tr>
          <tr><th style="background:#f1f5f9;">3. 情境設計真實性與難易度</th><td>□ 1分(太簡單)   □ 2分   □ 3分(適中)   □ 4分   □ 5分(極具挑戰)</td></tr>
          <tr><th style="background:#f1f5f9;">4. 此次演練最順利的強項為何？</th><td style="height:80px;"></td></tr>
          <tr><th style="background:#f1f5f9;">5. 遇到哪些非預期狀況或卡關處？<br/><span style="font-weight:normal; font-size:0.85em;">(例如：動線、設備、通訊或SOP問題)</span></th><td style="height:100px;"></td></tr>
          <tr><th style="background:#f1f5f9;">6. 對未來計畫修訂或訓練的具體建議</th><td style="height:100px;"></td></tr>
        </table>
      `;
    }

    const fullHtml = `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8"><title>${fileName}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, '微軟正黑體', sans-serif; line-height: 1.6; color: #1f2937; max-width: 900px; margin: 0 auto; padding: 30px 20px; }
        h1 { text-align: center; color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 12px; }
        h2 { color: #1e40af; border-left: 5px solid #2563eb; padding-left: 10px; background: #eff6ff; padding-top: 6px; padding-bottom: 6px; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.92em; }
        th, td { border: 1px solid #94a3b8; padding: 8px 10px; text-align: left; vertical-align: top; }
      </style></head><body>${bodyHtml}</body></html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`📄 已成功匯出「${fileName}」！`);
  };

  // --- 匯出分眾角色專屬訓練簡報卡 ---
  const exportRoleBriefingCard = (roleKey) => {
    let roleMeta = null;
    for (const cat of ROLE_CATEGORIES) {
      const found = cat.roles.find(r => r.key === roleKey);
      if (found) { roleMeta = found; break; }
    }
    const curriculum = ROLE_TRAINING_CURRICULUM[roleKey];
    if (!roleMeta || !curriculum) return;

    const assignedPerson = formData.rolesRoster?.[roleKey] || '（尚未指派具體姓名）';
    const isSecretCleared = curriculum.clearance === 'SECRET';
    const rulesHtml = curriculum.goldenRules.map(r => `<li style="margin-bottom:8px;">${r}</li>`).join('');
    const tasksHtml = curriculum.tasks.map(t => `
      <tr>
        <td style="width:18%; font-weight:bold; color:#1e3a8a;">${t.phase}</td>
        <td>□ ${t.text}</td>
      </tr>
    `).join('');

    let scenarioSectionHtml = '';
    if (isSecretCleared) {
      const mselSummary = formData.mselList.map((m, idx) => `
        <tr>
          <td style="text-align:center;">#${idx + 1}</td>
          <td style="text-align:center; font-weight:bold;">${m.time || '-'}</td>
          <td>${m.sender} → ${m.receiver}</td>
          <td>${m.event}</td>
        </tr>
      `).join('');
      scenarioSectionHtml = `
        <div style="background:#fef2f2; border:2px solid #dc2626; color:#991b1b; padding:10px; border-radius:6px; font-weight:bold; margin:20px 0;">
          🔒 機密等級：控制與評估團隊專用（嚴禁轉發給參演人員）
        </div>
        <h2>參、 本次演習情境與 MSEL 狀況總覽</h2>
        <p><strong>演習背景：</strong>${formData.scenarioBackground || '尚未填寫'}</p>
        <table>
          <thead><tr style="background:#1e3a8a; color:white;"><th>編號</th><th>時間</th><th>通報流向</th><th>狀況內容摘要</th></tr></thead>
          <tbody>${mselSummary || '<tr><td colspan="4" style="text-align:center;">尚未建立 MSEL</td></tr>'}</tbody>
        </table>
      `;
    } else {
      const objList = formData.objectivesList.map((o, i) => `<li><strong>目標 ${i + 1}：</strong>${o.text}</li>`).join('');
      scenarioSectionHtml = `
        <div style="background:#ecfdf5; border:2px solid #059669; color:#065f46; padding:10px; border-radius:6px; font-weight:bold; margin:20px 0;">
          📢 參演人員與外部支援單位公開簡報（依 HSEEP 規範已自動隱藏機密突發狀況題目）
        </div>
        <h2>參、 本次演習公開資訊與驗證目標</h2>
        <p><strong>演習場地：</strong>${formData.venues || '依現場指揮與簡報指示'}</p>
        <ul>${objList || '<li>依現行災害防救計畫與標準作業程序執行應變</li>'}</ul>
        <p><strong>安全守則：</strong>若遇真實意外發生，聽到<strong>「真實意外，停止演習」</strong>口令請立即停止動作並協助真實救援。</p>
      `;
    }

    const fileName = `${formData.exerciseName || 'TDEEP'}_角色簡報卡_${roleMeta.label.split(' ')[0]}.html`;
    const htmlContent = `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8"><title>${fileName}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, '微軟正黑體', sans-serif; line-height: 1.6; color: #1f2937; max-width: 850px; margin: 0 auto; padding: 30px 20px; }
        h1 { text-align: center; color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; }
        h2 { color: #1e40af; border-left: 5px solid #2563eb; padding-left: 10px; background: #eff6ff; padding-top: 5px; padding-bottom: 5px; margin-top: 25px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #94a3b8; padding: 8px 10px; text-align: left; }
        .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; }
      </style></head><body>
      <h1>${formData.exerciseName || '災害防救演習'}<br/><span style="font-size:0.65em; color:#475569;">角色任務與演習精神專屬簡報卡</span></h1>
      <table>
        <tr><th style="width:20%; background:#f1f5f9;">演習角色</th><td style="font-weight:bold; color:#1e3a8a;">${roleMeta.label}</td><th style="width:20%; background:#f1f5f9;">核心定位</th><td>${curriculum.badge}</td></tr>
        <tr><th style="background:#f1f5f9;">指派人員姓名</th><td colspan="3" style="font-weight:bold; font-size:1.1em; color:#b91c1c;">${assignedPerson}</td></tr>
        <tr><th style="background:#f1f5f9;">演習日期與類型</th><td colspan="3">${formData.exerciseDate || '未定'} ｜ ${formData.exerciseType}</td></tr>
      </table>
      <h2>壹、 角色核心精神與紅線原則</h2>
      <div class="box">
        <p style="font-weight:bold; color:#1e3a8a; margin-top:0;">💡 ${curriculum.spiritTitle}</p>
        <p>${curriculum.spiritSummary}</p>
        <ul>${rulesHtml}</ul>
      </div>
      <h2>貳、 演前、演中、演後行動檢核清單</h2>
      <table><tbody>${tasksHtml}</tbody></table>
      ${scenarioSectionHtml}
      </body></html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`🎓 已匯出「${roleMeta.label.split(' ')[0]}」專屬簡報卡！`);
  };

  // --- 共用子區塊渲染：每階段主責人輸入列 ---
  const renderStageOwnerBar = (stepIdx) => {
    const assign = formData.stageAssignments?.[stepIdx] || { owner: '', dueDate: '', notes: '' };
    return (
      <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 mb-5 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center shadow-sm">
        <div className="md:col-span-4">
          <label className="block text-[11px] font-bold text-slate-700">👤 本階段主責規劃人員姓名／職稱</label>
          <input
            type="text"
            className="mt-1 w-full p-1.5 text-xs border border-slate-300 rounded bg-white text-gray-900 font-bold"
            placeholder="輸入負責人姓名..."
            value={assign.owner}
            onChange={(e) => updateStageAssignment(stepIdx, 'owner', e.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-[11px] font-bold text-slate-700">📅 預定完成／會議日期</label>
          <input
            type="text"
            className="mt-1 w-full p-1.5 text-xs border border-slate-300 rounded bg-white text-gray-900"
            placeholder="例：115/10/15"
            value={assign.dueDate}
            onChange={(e) => updateStageAssignment(stepIdx, 'dueDate', e.target.value)}
          />
        </div>
        <div className="md:col-span-5">
          <label className="block text-[11px] font-bold text-slate-700">📝 階段分工備註</label>
          <input
            type="text"
            className="mt-1 w-full p-1.5 text-xs border border-slate-300 rounded bg-white text-gray-900"
            placeholder="輸入協辦單位或會議重點..."
            value={assign.notes}
            onChange={(e) => updateStageAssignment(stepIdx, 'notes', e.target.value)}
          />
        </div>
      </div>
    );
  };

  // --- 共用子區塊渲染：全組織角色權責名冊面板 ---
  const renderRosterPanel = () => {
    const conflictName = detectRoleConflict();
    return (
      <div className="space-y-4">
        {conflictName && (
          <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-xs text-red-900">
            <strong>🚨 T-DEEP 球員兼裁判警示：</strong> 偵測到「<strong>{conflictName}</strong>」同時出現在「控制／評估團隊」與「參演人員」中！依指引規定，規劃與控制評估人員不得兼任參演者，以免洩漏題目影響客觀性。
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLE_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/70 space-y-2.5">
              <div className={`text-xs font-bold px-2.5 py-1 rounded text-white ${
                cat.color === 'blue' ? 'bg-blue-800' :
                cat.color === 'amber' ? 'bg-amber-700' :
                cat.color === 'red' ? 'bg-red-800' : 'bg-emerald-800'
              }`}>
                {cat.group}
              </div>
              {cat.roles.map((role) => (
                <div key={role.key} className="bg-white p-2 rounded border border-gray-200">
                  <label className="block text-xs font-bold text-gray-800">{role.label}</label>
                  <span className="block text-[11px] text-gray-500 mb-1">{role.desc}</span>
                  <input
                    type="text"
                    className="w-full p-1.5 text-xs border border-gray-300 rounded bg-white text-gray-900 font-medium"
                    placeholder="輸入負責人員姓名與職稱..."
                    value={formData.rolesRoster?.[role.key] || ''}
                    onChange={(e) => updateRoleRoster(role.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- 訓練中心主畫面渲染 ---
  const renderTrainingCenter = () => {
    let activeRoleMeta = null;
    let activeGroupColor = 'blue';
    for (const cat of ROLE_CATEGORIES) {
      const found = cat.roles.find(r => r.key === selectedTrainingRole);
      if (found) {
        activeRoleMeta = found;
        activeGroupColor = cat.color;
        break;
      }
    }
    const curriculum = ROLE_TRAINING_CURRICULUM[selectedTrainingRole];
    const assignedName = formData.rolesRoster?.[selectedTrainingRole] || '';
    const isSecret = curriculum.clearance === 'SECRET';

    const roleTasks = curriculum.tasks;
    const completedTaskCount = roleTasks.filter((_, idx) => checkedTasks[`${selectedTrainingRole}_${idx}`]).length;
    const roleQuiz = curriculum.quiz;
    const correctQuizCount = roleQuiz.filter((q, idx) => quizAnswers[`${selectedTrainingRole}_${idx}`] === q.ans).length;
    const isCertified = completedTaskCount === roleTasks.length && correctQuizCount === roleQuiz.length;

    return (
      <div className="p-5 md:p-8 flex-grow overflow-y-auto space-y-6">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-0.5 rounded">T-DEEP & HSEEP 職能訓練</span>
              <span className="text-xs text-indigo-200">建立全體人員共通語言與任務共識</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold">🎓 演習角色任務與精神訓練中心</h2>
            <p className="text-xs text-slate-300 mt-1">請點選下方您的演習角色，系統將自動結合本次劇本（並依 HSEEP 規範區分機密權限），引導您掌握職責與紅線原則。</p>
          </div>
          <button
            onClick={() => exportRoleBriefingCard(selectedTrainingRole)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>🖨️</span>
            <span>匯出本角色專屬簡報卡</span>
          </button>
        </div>

        {/* 角色選擇矩陣 */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">👇 第一步：請選擇您本次擔任的演習角色（自動同步人員名冊）：</span>
            <button onClick={() => setShowRosterModal(true)} className="text-xs text-blue-600 hover:underline font-bold">✏️ 編輯人員姓名</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {ROLE_CATEGORIES.map((cat, cIdx) => (
              <div key={cIdx} className="bg-white border border-gray-200 rounded-lg p-2.5 space-y-1.5 shadow-sm">
                <div className={`text-[11px] font-bold px-2 py-1 rounded text-white ${
                  cat.color === 'blue' ? 'bg-blue-800' :
                  cat.color === 'amber' ? 'bg-amber-700' :
                  cat.color === 'red' ? 'bg-red-800' : 'bg-emerald-800'
                }`}>
                  {cat.group.split(' ')[0]}
                </div>
                <div className="space-y-1">
                  {cat.roles.map((r) => {
                    const isSelected = selectedTrainingRole === r.key;
                    const personName = formData.rolesRoster?.[r.key];
                    const rTasks = ROLE_TRAINING_CURRICULUM[r.key].tasks;
                    const rQuiz = ROLE_TRAINING_CURRICULUM[r.key].quiz;
                    const rDone = rTasks.every((_, i) => checkedTasks[`${r.key}_${i}`]) && rQuiz.every((q, i) => quizAnswers[`${r.key}_${i}`] === q.ans);

                    return (
                      <button
                        key={r.key}
                        onClick={() => setSelectedTrainingRole(r.key)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-all flex flex-col border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm font-bold'
                            : 'bg-gray-50 hover:bg-indigo-50 text-gray-800 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{r.label.split(' (')[0]}</span>
                          {rDone && <span title="已完成本角色訓練與測驗">🏅</span>}
                        </div>
                        <span className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {personName ? `👤 ${personName}` : '（尚未指派姓名）'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 當前角色訓練主看板 */}
        <div className="bg-white border-2 border-indigo-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-indigo-50 px-5 py-4 border-b border-indigo-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded text-white ${
                  activeGroupColor === 'blue' ? 'bg-blue-700' :
                  activeGroupColor === 'amber' ? 'bg-amber-600' :
                  activeGroupColor === 'red' ? 'bg-red-700' : 'bg-emerald-700'
                }`}>
                  {curriculum.badge}
                </span>
                {isSecret ? (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">🔒 控制與評估機密權限</span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">🛡️ 參演與支援公開權限（防劇透保護）</span>
                )}
                {isCertified && (
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-amber-400 text-slate-900 shadow-sm">🏅 已通過本角色任務認證！</span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mt-1.5">{activeRoleMeta?.label}</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                <strong>本次指派人員：</strong>
                <span className="text-indigo-900 font-bold text-sm">{assignedName || '尚未在名冊中輸入姓名'}</span>
                <span className="mx-2 text-gray-300">|</span>
                <span>{activeRoleMeta?.desc}</span>
              </p>
            </div>

            <div className="flex bg-white p-1 rounded-lg border border-indigo-200 shadow-sm shrink-0">
              <button
                onClick={() => setTrainingTab('SPIRIT')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${trainingTab === 'SPIRIT' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                1. 核心精神與任務 ({completedTaskCount}/{roleTasks.length})
              </button>
              <button
                onClick={() => setTrainingTab('BRIEF')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${trainingTab === 'BRIEF' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                2. 本次劇本專屬簡報
              </button>
              <button
                onClick={() => setTrainingTab('QUIZ')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${trainingTab === 'QUIZ' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                3. 實戰隨堂測驗 ({correctQuizCount}/{roleQuiz.length})
              </button>
            </div>
          </div>

          <div className="p-5">
            {trainingTab === 'SPIRIT' && (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl">
                  <h4 className="font-extrabold text-blue-950 text-base mb-1.5">🧭 核心演習精神：{curriculum.spiritTitle}</h4>
                  <p className="text-sm text-blue-900 leading-relaxed">{curriculum.spiritSummary}</p>
                </div>

                <div>
                  <h4 className="font-bold text-red-900 text-sm mb-2 flex items-center gap-1.5">
                    <span>🚨</span> 本角色必須嚴守的「四大紅線原則 (Golden Rules)」
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {curriculum.goldenRules.map((rule, idx) => (
                      <div key={idx} className="bg-red-50/70 border border-red-200 p-3 rounded-lg text-xs text-red-950 flex items-start gap-2">
                        <span className="bg-red-700 text-white font-bold px-1.5 py-0.5 rounded text-[11px] shrink-0">{idx + 1}</span>
                        <span className="leading-relaxed">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center justify-between">
                    <span>✅ 演前、演中、演後標準任務檢核表（請逐項閱讀並勾選確認）</span>
                    <span className="text-xs text-indigo-600">已完成 {completedTaskCount} / {roleTasks.length} 項</span>
                  </h4>
                  <div className="space-y-2">
                    {roleTasks.map((task, idx) => {
                      const checkKey = `${selectedTrainingRole}_${idx}`;
                      const isChecked = !!checkedTasks[checkKey];
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-emerald-50 border-emerald-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            checked={isChecked}
                            onChange={() => setCheckedTasks(prev => ({ ...prev, [checkKey]: !prev[checkKey] }))}
                          />
                          <span className="bg-slate-800 text-white text-[11px] font-bold px-2 py-0.5 rounded shrink-0">{task.phase}</span>
                          <span className={`text-xs font-medium ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-gray-900'}`}>{task.text}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {trainingTab === 'BRIEF' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-100 p-3 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-800">
                    <strong>目前載入劇本：</strong>{formData.exerciseName || '尚未命名演習（可至左側載入範例）'} ｜ <strong>預定日期：</strong>{formData.exerciseDate || '未定'}
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700">✨ 系統已依角色自動過濾資訊權限</span>
                </div>

                {isSecret ? (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-xs text-red-900">
                      <strong>🔒 控制與評估團隊機密視角：</strong> 您擁有完整情境與 MSEL 狀況卡檢視權限。請熟記下達時機與預期處置基準，並嚴防向參演人員洩漏任何突發狀況內容！
                    </div>
                    <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-xs space-y-1.5">
                      <div><strong className="text-gray-800">初始實況背景 (Ground Truth)：</strong>{formData.scenarioBackground || '尚未填寫'}</div>
                      <div><strong className="text-gray-800">演練場地配置：</strong>{formData.venues || '尚未填寫'}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-2">⚡ 本次演習主境況事件清單 (MSEL) 執行與評估重點 ({formData.mselList.length} 筆)</h4>
                      {formData.mselList.length === 0 ? (
                        <p className="text-xs text-gray-500 p-4 bg-gray-50 rounded border border-dashed text-center">目前尚未建立 MSEL 狀況卡，請至「規劃導航 STEP 4」新增或載入左側範例。</p>
                      ) : (
                        <div className="space-y-2">
                          {formData.mselList.map((m, idx) => (
                            <div key={idx} className="border border-slate-300 rounded-lg p-3 bg-white text-xs space-y-1 shadow-sm">
                              <div className="flex justify-between font-bold text-blue-900 border-b pb-1">
                                <span>Inject #{idx + 1}（{m.time || '未定時間'}）— {m.injectType || '一般狀況'}</span>
                                <span className="text-red-700">評估員：{m.evaluatorName || '未指定'}</span>
                              </div>
                              <div><strong>通報流向：</strong>{m.sender} ➔ {m.receiver}</div>
                              <div className="text-gray-900"><strong>狀況內容：</strong>{m.event}</div>
                              <div className="text-emerald-800 bg-emerald-50 p-1.5 rounded"><strong>預期處置基準：</strong>{m.expectedAction}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded text-xs text-emerald-950">
                      <strong>🛡️ 參演者與外部支援視角（防劇透保護已啟動）：</strong> 依 HSEEP 規範，參演人員在演練前不應預知具體的 MSEL 突發狀況題目，以確保臨場應變的真實性。以下為您必須熟知的公開演習規則與驗證目標：
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 space-y-1.5">
                        <h5 className="font-bold text-gray-900 text-sm">📍 演習場地與動線範圍</h5>
                        <p className="whitespace-pre-wrap text-gray-700">{formData.venues || '依現場簡報與指示牌引導'}</p>
                      </div>
                      <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200 space-y-1.5">
                        <h5 className="font-bold text-gray-900 text-sm">🎯 本次演習欲驗證之核心目標</h5>
                        {formData.objectivesList.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {formData.objectivesList.map((o) => <li key={o.id}>{o.text}</li>)}
                          </ul>
                        ) : (
                          <p className="text-gray-600">依據現行災害防救計畫與標準作業程序執行應變。</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg text-xs text-amber-950 space-y-1">
                      <div className="font-bold text-sm">⚠️ 參演者現場行動鐵律：</div>
                      <p>1. <strong>視同真實災害操作：</strong>請依日常職責使用真實通訊設備、平面圖與 SOP 執行處置，切勿「假裝演戲」。</p>
                      <p>2. <strong>安全與中止口令：</strong>若現場發生真實人員受傷或意外，聽到<strong>「真實意外，停止演習」</strong>口令時，請立即停止演練並協助真實救援。</p>
                      <p>3. <strong>演後即時反饋 (Hotwash)：</strong>演練結束後 30 分鐘內請準時出席 Hotwash，大膽分享現場發現的制度或設備問題！</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {trainingTab === 'QUIZ' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">🧠 角色實戰情境測驗（全部答對即可取得本角色完訓認證 🏅）</h4>
                  <span className="text-xs font-bold text-indigo-700">目前答對：{correctQuizCount} / {roleQuiz.length} 題</span>
                </div>
                {roleQuiz.map((item, qIdx) => {
                  const ansKey = `${selectedTrainingRole}_${qIdx}`;
                  const userChoice = quizAnswers[ansKey];
                  const hasAnswered = userChoice !== undefined;
                  const isCorrect = userChoice === item.ans;

                  return (
                    <div key={qIdx} className="border border-gray-300 rounded-xl p-4 bg-gray-50 space-y-3">
                      <div className="font-bold text-sm text-gray-900">Q{qIdx + 1}. {item.q}</div>
                      <div className="space-y-2">
                        {item.options.map((opt, oIdx) => {
                          let btnStyle = 'bg-white border-gray-300 text-gray-800 hover:bg-indigo-50';
                          if (hasAnswered) {
                            if (oIdx === item.ans) btnStyle = 'bg-emerald-600 border-emerald-700 text-white font-bold';
                            else if (oIdx === userChoice) btnStyle = 'bg-red-600 border-red-700 text-white';
                          }
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [ansKey]: oIdx }))}
                              className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${btnStyle}`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>
                      {hasAnswered && (
                        <div className={`p-3 rounded-lg text-xs leading-relaxed ${isCorrect ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-red-100 text-red-950 border border-red-300'}`}>
                          <strong>{isCorrect ? '✅ 觀念完全正確！' : '❌ 觀念再釐清一下：'}</strong> {item.exp}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- 六大步驟主表單內容渲染 ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">演習名稱</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" placeholder="例如：臺北市115年度災害防救演習" value={formData.exerciseName} onChange={(e) => updateFormData('exerciseName', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">演習種類 (依循序漸進原則選擇)</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" value={formData.exerciseType} onChange={(e) => updateFormData('exerciseType', e.target.value)}>
                    <option>專題討論 (Seminar) - 討論政策與知識共享</option>
                    <option>工作坊 (Workshop) - 研擬計畫草案或SOP</option>
                    <option>桌上推演 (TTX) - 無時間壓力之決策推演</option>
                    <option>技術訓練 (Drill) - 單一裝備操作或局部技能</option>
                    <option>功能演習 (FE) - 測試指揮中心調度(不調動實兵)</option>
                    <option>實兵演練 (FSE) - 最複雜之跨單位全尺度演練</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">災害類別</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" placeholder="例如：複合型災害 (地震引發火災與停氣)" value={formData.disasterType} onChange={(e) => updateFormData('disasterType', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">預定正式演習日期與時間</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" placeholder="例如：115年11月12日 下午14:00-16:00" value={formData.exerciseDate} onChange={(e) => updateFormData('exerciseDate', e.target.value)} />
              </div>
            </div>

            <div className="pt-4 border-t-2 border-gray-200">
              <div className="mb-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                  <span>👥</span> 成立演習規劃小組與各職位人員指派 (T-DEEP / HSEEP 權責名冊)
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">在此輸入各功能組負責人員姓名後，後續階段的狀況下達與評估表將自動帶入這些姓名，並於匯出時生成完整權責表。</p>
              </div>
              {renderRosterPanel()}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
              <h4 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-1">
                <span>🪄</span> SMART 演習目標智慧造句機 (填空後點擊新增，自動組合標準句型)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-bold text-indigo-800">1. 時限 (Time-bound)</label>
                  <input type="text" className="w-full p-2 text-sm border rounded bg-white text-gray-900" placeholder="例：災後 10 分鐘內" value={smartBuilder.time} onChange={e => setSmartBuilder({ ...smartBuilder, time: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-800">2. 執行對象 (Who / Specific)</label>
                  <input type="text" className="w-full p-2 text-sm border rounded bg-white text-gray-900" placeholder="例：ICU 夜班護理與疏散班" value={smartBuilder.who} onChange={e => setSmartBuilder({ ...smartBuilder, who: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-800">3. 依據規範/標準 (Relevant)</label>
                  <input type="text" className="w-full p-2 text-sm border rounded bg-white text-gray-900" placeholder="例：RACE與水平疏散SOP" value={smartBuilder.standard} onChange={e => setSmartBuilder({ ...smartBuilder, standard: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-800">4. 可量化之關鍵任務 (Measurable Action)</label>
                  <input type="text" className="w-full p-2 text-sm border rounded bg-white text-gray-900" placeholder="例：完成 8 名重症病患水平撤離至鄰區" value={smartBuilder.action} onChange={e => setSmartBuilder({ ...smartBuilder, action: e.target.value })} />
                </div>
              </div>
              <button onClick={addFromSmartBuilder} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-sm transition-colors shadow-sm">
                ＋ 組合並加入演習目標清單
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">已訂定的演習目標清單 ({formData.objectivesList.length} 項)</label>
                <button onClick={() => addObjective('於災後 __ 分鐘內，由【單位】依【規範】完成【任務】。')} className="text-xs text-blue-600 hover:underline font-bold">+ 手動新增空白目標</button>
              </div>
              {formData.objectivesList.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-dashed rounded text-center text-gray-500 text-sm">尚未新增目標，請使用上方造句機或載入左側範例。</div>
              ) : (
                <div className="space-y-2">
                  {formData.objectivesList.map((obj, idx) => (
                    <div key={obj.id} className="flex items-start gap-2 bg-gray-50 p-2.5 rounded border border-gray-300">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mt-1 shrink-0">目標 {idx + 1}</span>
                      <input
                        type="text"
                        className="w-full p-1.5 text-sm bg-white border border-gray-200 rounded text-gray-900"
                        value={obj.text}
                        onChange={(e) => updateObjectiveText(obj.id, e.target.value)}
                      />
                      <button onClick={() => removeObjective(obj.id)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1 text-sm shrink-0">刪除</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">達成目標所需之「核心能力 (Core Capabilities)」</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" rows="3" placeholder="例如：1. 災情通報與研判 2. 供氧中斷備援切換 3. 避難弱者水平疏散..." value={formData.coreCapabilities} onChange={(e) => updateFormData('coreCapabilities', e.target.value)}></textarea>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700">情境背景與初始實況設定 (Ground Truth)</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" rows="3" placeholder="描述演習開始前的背景資訊（時間、地點、災害規模、當時值班人力限制）..." value={formData.scenarioBackground} onChange={(e) => updateFormData('scenarioBackground', e.target.value)}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">場地規劃、布景搭設與動線分流</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" rows="3" placeholder="例如：1. 主災區(8F) 2. 水平避難區(8F鄰區) 3. 支援人力集結點(7F) 4. 前進指揮所與大傷站(1F)..." value={formData.venues} onChange={(e) => updateFormData('venues', e.target.value)}></textarea>
            </div>

            <div className="border-2 border-indigo-200 bg-indigo-50/60 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200 pb-3">
                <div>
                  <h4 className="font-bold text-indigo-950 text-base flex items-center gap-1.5">
                    <span>🧩</span> 實戰搶救戰術與救護傷病模組 (可複選)
                  </h4>
                  <p className="text-xs text-indigo-800 mt-0.5">勾選本次演習欲驗證的消防搶救作為與臨床疾病，系統可一鍵自動生成對應的 MSEL 劇本與演員症狀卡！</p>
                </div>
                <button
                  onClick={generateMselFromSelections}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow transition-transform active:scale-95 shrink-0"
                >
                  🪄 一鍵轉為 MSEL 狀況卡
                </button>
              </div>

              <div>
                <h5 className="text-xs font-bold text-red-800 mb-2 flex items-center gap-1">
                  <span>🚒</span> 一、消防救災與火場搶救作為
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {FIRE_TACTICS_DATA.map((tactic) => {
                    const checked = (formData.selectedTactics || []).includes(tactic.id);
                    return (
                      <label
                        key={tactic.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${checked ? 'bg-red-50 border-red-400 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 rounded text-red-600 focus:ring-red-500"
                          checked={checked}
                          onChange={() => toggleSelection('selectedTactics', tactic.id)}
                        />
                        <div className="text-xs">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{tactic.title}</span>
                            <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded">{tactic.tag}</span>
                          </div>
                          <p className="text-gray-600 mt-1 line-clamp-2">{tactic.event}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <h5 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1">
                  <span>🚑</span> 二、緊急救護與臨床特殊疾病狀況
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {EMS_DISEASES_DATA.map((disease) => {
                    const checked = (formData.selectedDiseases || []).includes(disease.id);
                    return (
                      <label
                        key={disease.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${checked ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                          checked={checked}
                          onChange={() => toggleSelection('selectedDiseases', disease.id)}
                        />
                        <div className="text-xs">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{disease.title}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">{disease.tag}</span>
                          </div>
                          <p className="text-rose-700 font-medium mt-0.5">{disease.vitals}</p>
                          <p className="text-gray-600 mt-0.5 line-clamp-2">{disease.symptoms}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {uncoveredObjectives.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-800">
                <strong>⚠️ 目標勾稽防呆提醒：</strong> 您有 {uncoveredObjectives.length} 個演習目標尚未安排任何 MSEL 狀況來進行驗證！
                <ul className="list-disc list-inside mt-1">
                  {uncoveredObjectives.map(o => <li key={o.id}>{o.text}</li>)}
                </ul>
              </div>
            )}

            <div className="border border-amber-300 bg-amber-50 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowPresetsDrawer(!showPresetsDrawer)}
                className="w-full p-3 text-left font-bold text-amber-950 text-sm flex justify-between items-center hover:bg-amber-100 transition-colors"
              >
                <span>✨ 打開「消防搶救戰術 / 臨床救護疾病 / SWEAT-M 斷鏈」實戰靈感庫</span>
                <span>{showPresetsDrawer ? '▲ 收合' : '▼ 展開選擇'}</span>
              </button>
              {showPresetsDrawer && (
                <div className="p-3 bg-white border-t border-amber-200 space-y-3">
                  <div className="flex flex-wrap gap-1.5 border-b pb-2">
                    <button
                      onClick={() => setPresetTab('FIRE')}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${presetTab === 'FIRE' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      🚒 消防搶救戰術
                    </button>
                    <button
                      onClick={() => setPresetTab('EMS')}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${presetTab === 'EMS' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      🚑 救護特殊疾病
                    </button>
                    <button
                      onClick={() => setPresetTab('SWEATM')}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${presetTab === 'SWEATM' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      ⚡ SWEAT-M 與 PACE 備援
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                    {presetTab === 'FIRE' && FIRE_TACTICS_DATA.map((t) => (
                      <div key={t.id} className="flex justify-between items-center p-2.5 border border-red-100 rounded hover:bg-red-50/40 text-xs">
                        <div className="pr-2">
                          <span className="font-bold text-red-900 block">🚒 {t.title} ({t.tag})</span>
                          <span className="text-gray-700">{t.event}</span>
                        </div>
                        <button
                          onClick={() => addMsel(`【${t.title}】${t.event}`, t.action, '現場控制官', '自衛消防編組 / 消防指揮官')}
                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded shrink-0"
                        >
                          + 加入劇本
                        </button>
                      </div>
                    ))}

                    {presetTab === 'EMS' && EMS_DISEASES_DATA.map((d) => (
                      <div key={d.id} className="flex justify-between items-center p-2.5 border border-emerald-100 rounded hover:bg-emerald-50/40 text-xs">
                        <div className="pr-2">
                          <span className="font-bold text-emerald-900 block">🚑 {d.title} — <span className="text-rose-600">{d.vitals}</span></span>
                          <span className="text-gray-700">{d.event}</span>
                        </div>
                        <button
                          onClick={() => addMsel(`【臨床救護：${d.title}】${d.event}（${d.vitals}）`, d.action, '臨演(持症狀卡)', '救護班 / 醫療人員')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shrink-0"
                        >
                          + 加入劇本
                        </button>
                      </div>
                    ))}

                    {presetTab === 'SWEATM' && SWEATM_PRESETS.map((preset, i) => (
                      <div key={i} className="flex justify-between items-center p-2.5 border border-amber-100 rounded hover:bg-amber-50/40 text-xs">
                        <div className="pr-2">
                          <span className="font-bold text-amber-800 block">{preset.cat}</span>
                          <span className="text-gray-700">狀況：{preset.event}</span>
                        </div>
                        <button
                          onClick={() => addMsel(preset.event, preset.action)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded shrink-0"
                        >
                          + 加入劇本
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <h3 className="text-base font-bold text-gray-800">主境況事件清單 (MSEL) — 共 {formData.mselList.length} 筆狀況</h3>
              <button onClick={() => addMsel()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-bold shadow-sm">
                + 手動新增狀況 (Inject)
              </button>
            </div>

            {formData.mselList.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 border-2 border-dashed rounded-md text-gray-500">
                尚無狀況，請點擊上方按鈕或從靈感庫套用。
              </div>
            ) : (
              formData.mselList.map((msel, index) => (
                <div key={index} className="p-4 bg-gray-50 border border-gray-300 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-3 relative shadow-sm">
                  <div className="md:col-span-4 flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="font-bold text-blue-900 text-sm">⚡ 狀況卡 Inject #{index + 1}</span>
                    <button onClick={() => removeMsel(index)} className="text-xs text-red-500 hover:underline font-bold">刪除此狀況</button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">下達時間 (Time)</label>
                    <input type="text" className="mt-1 block w-full rounded border-gray-300 p-1.5 text-sm border text-gray-900 bg-white" placeholder="例: 18:25" value={msel.time} onChange={(e) => updateMsel(index, 'time', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">事件類型 (HSEEP規範)</label>
                    <select
                      className="mt-1 block w-full rounded border-gray-300 p-1.5 text-sm border text-gray-900 bg-white"
                      value={msel.injectType || '一般狀況 (Inject)'}
                      onChange={(e) => updateMsel(index, 'injectType', e.target.value)}
                    >
                      <option value="一般狀況 (Inject)">一般狀況 (Inject)</option>
                      <option value="應急引導狀況 (Contingency Inject)">應急引導 (Contingency)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">誰下達 (控制官/臨演)</label>
                    <input type="text" className="mt-1 block w-full rounded border-gray-300 p-1.5 text-sm border text-gray-900 bg-white" placeholder="例: 現場控制官" value={msel.sender} onChange={(e) => updateMsel(index, 'sender', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700">接收單位 (參演者)</label>
                    <input type="text" className="mt-1 block w-full rounded border-gray-300 p-1.5 text-sm border text-gray-900 bg-white" placeholder="例: ICU護理長" value={msel.receiver} onChange={(e) => updateMsel(index, 'receiver', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-blue-800">🎯 對應驗證之演習目標</label>
                    <select
                      className="mt-1 block w-full rounded border-blue-300 p-1.5 text-sm border text-gray-900 bg-blue-50 font-medium"
                      value={msel.targetObjId || ''}
                      onChange={(e) => updateMsel(index, 'targetObjId', e.target.value)}
                    >
                      <option value="">-- 請選擇此狀況欲測試的演習目標 --</option>
                      {formData.objectivesList.map((o, idx) => (
                        <option key={o.id} value={o.id}>目標 {idx + 1}：{o.text.slice(0, 42)}...</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-red-800">👁️ 負責觀察與評核此狀況之「評估員姓名」</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded border-red-200 p-1.5 text-sm border text-gray-900 bg-red-50/50 font-medium"
                      placeholder={formData.rolesRoster?.evaluators ? `參考評估小組：${formData.rolesRoster.evaluators}` : '輸入負責記錄此狀況的評估員姓名...'}
                      value={msel.evaluatorName || ''}
                      onChange={(e) => updateMsel(index, 'evaluatorName', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-700">狀況訊息內容 (Event / Inject Description)</label>
                    <input type="text" className="mt-1 block w-full rounded border-gray-300 p-1.5 text-sm border text-gray-900 bg-white" placeholder="描述參演者會看到或聽到的災情..." value={msel.event} onChange={(e) => updateMsel(index, 'event', e.target.value)} />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-emerald-800">預期參演者處置作為 (評估員打分數的核對基準)</label>
                    <input type="text" className="mt-1 block w-full rounded border-emerald-300 p-1.5 text-sm border text-gray-900 bg-emerald-50" placeholder="參演者依SOP應該做出的正確反應..." value={msel.expectedAction} onChange={(e) => updateMsel(index, 'expectedAction', e.target.value)} />
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs text-amber-950">
                <strong>📢 演練前最終確認 (FPM)：</strong> 請確認控制組、評估組與模擬組人員名單皆已定案，並安排各角色事前簡報與職能訓練 (Briefings)。
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => setAppMode('TRAINING')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded text-xs"
                >
                  🎓 開啟角色任務訓練中心
                </button>
                <button
                  onClick={() => setShowRosterModal(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs"
                >
                  👥 檢視／修改全體人員名冊
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">行政、後勤與安全確認清單 (Final Planning Check)</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:border-blue-500 focus:ring-blue-500 text-gray-900 bg-white" rows="6" placeholder="1. 救災動線與參觀動線是否實體分流？&#10;2. 假人道具與傷情卡是否備妥？&#10;3. 緊急中止口令為何？..." value={formData.logisticsCheck} onChange={(e) => updateFormData('logisticsCheck', e.target.value)}></textarea>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 text-white p-4 rounded-lg">
              <h4 className="font-bold text-base mb-1">📊 互動式演習評估指南 (EEG) 與 5Why 根本原因分析</h4>
              <p className="text-xs text-gray-300">系統已自動載入您在第二階段設定的演習目標。請填寫負責評估員姓名並給予能力評級，若選擇 S / M / U，系統將自動展開根本原因追問與改善主責人欄位。</p>
            </div>

            {formData.objectivesList.length === 0 ? (
              <div className="p-6 text-center bg-gray-50 border rounded text-gray-500">請先至「第二階段」新增演習目標，才能進行目標對應評估喔！</div>
            ) : (
              formData.objectivesList.map((obj, index) => {
                const ev = formData.evaluations?.[obj.id] || {
                  rating: 'P',
                  evaluatorName: formData.rolesRoster?.leadEvaluator || '',
                  observation: '',
                  rootCause: '',
                  poete: '訓練 (Training)',
                  correctiveAction: '',
                  actionOwner: '',
                  actionDueDate: ''
                };
                const needRootCause = ev.rating === 'M' || ev.rating === 'U' || ev.rating === 'S';
                return (
                  <div key={obj.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 shadow-sm">
                    <div className="font-bold text-blue-900 text-sm border-b pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span>目標 {index + 1}：{obj.text}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs text-gray-600 font-normal">評估員：</span>
                        <input
                          type="text"
                          className="p-1 text-xs border border-gray-300 rounded bg-white text-gray-900 font-bold w-36"
                          placeholder="輸入評估員姓名"
                          value={ev.evaluatorName || ''}
                          onChange={(e) => updateEval(obj.id, 'evaluatorName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">能力評級 (依 T-DEEP 附件4標準)</label>
                        <select
                          className="w-full p-2 text-sm border rounded font-bold bg-white text-gray-900"
                          value={ev.rating}
                          onChange={(e) => updateEval(obj.id, 'rating', e.target.value)}
                        >
                          <option value="P">🟢 P - 順利完成 (Performed without Challenges)</option>
                          <option value="S">🟡 S - 稍遇困難 (Performed with Some Challenges)</option>
                          <option value="M">🟠 M - 重大挑戰 (Performed with Major Challenges)</option>
                          <option value="U">🔴 U - 無法達成 (Unable to be Performed)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">POETE 持續精進分類 (HSEEP標準)</label>
                        <select
                          className="w-full p-2 text-sm border rounded bg-white text-gray-900"
                          value={ev.poete}
                          onChange={(e) => updateEval(obj.id, 'poete', e.target.value)}
                        >
                          <option>計畫 (Planning) - 修訂SOP或應變計畫</option>
                          <option>組織 (Organization) - 調整編組或跨單位分工</option>
                          <option>裝備 (Equipment) - 增購器材或通訊設備</option>
                          <option>訓練 (Training) - 加強人員操作熟練度</option>
                          <option>演習 (Exercise) - 調整下次演練設計</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700">客觀觀察紀錄 (實際發生了什麼事？花費多少時間？)</label>
                      <textarea
                        rows="2"
                        className="mt-1 w-full p-2 text-sm border rounded bg-white text-gray-900"
                        placeholder="請以事實描述參演者的表現..."
                        value={ev.observation}
                        onChange={(e) => updateEval(obj.id, 'observation', e.target.value)}
                      />
                    </div>

                    {needRootCause && (
                      <div className="bg-amber-50 border border-amber-300 p-3 rounded space-y-2">
                        <label className="block text-xs font-bold text-amber-900">🔍 根本原因分析 (5Why 追問法：為什麼沒做好？不要怪罪個人，請找制度或設備根源)</label>
                        <textarea
                          rows="2"
                          className="w-full p-2 text-sm border border-amber-300 rounded bg-white text-gray-900"
                          placeholder="例：為什麼疏散超時？因為氧氣瓶切換太慢 -> 為什麼太慢？因為轉接頭規格不熟..."
                          value={ev.rootCause}
                          onChange={(e) => updateEval(obj.id, 'rootCause', e.target.value)}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-1">
                      <div className="md:col-span-6">
                        <label className="block text-xs font-bold text-emerald-800">🛠️ 具體矯正與精進措施 (SMART 原則)</label>
                        <input
                          type="text"
                          className="mt-1 w-full p-2 text-sm border border-emerald-300 rounded bg-white text-gray-900"
                          placeholder="例：辦理夜班無照明氧氣切換技術訓練(Drill)..."
                          value={ev.correctiveAction}
                          onChange={(e) => updateEval(obj.id, 'correctiveAction', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-emerald-800">👤 改善主責人姓名／單位</label>
                        <input
                          type="text"
                          className="mt-1 w-full p-2 text-sm border border-emerald-300 rounded bg-white text-gray-900 font-medium"
                          placeholder="輸入負責人姓名..."
                          value={ev.actionOwner || ''}
                          onChange={(e) => updateEval(obj.id, 'actionOwner', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-emerald-800">📅 預定完成期限</label>
                        <input
                          type="text"
                          className="mt-1 w-full p-2 text-sm border border-emerald-300 rounded bg-white text-gray-900"
                          placeholder="例：115/12/31"
                          value={ev.actionDueDate || ''}
                          onChange={(e) => updateEval(obj.id, 'actionDueDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl mt-6">
              <h4 className="font-bold text-blue-900 text-base mb-2">🖨️ 多重視角正式公文匯出中心 (一鍵生成四種專屬文件)</h4>
              <p className="text-xs text-blue-800 mb-4">下載後的 HTML 檔案可直接用瀏覽器開啟，按 <strong>Ctrl + P (列印)</strong> 即可另存為排版精美的正式 PDF 報告！</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => exportDocument('PLAN')}
                  className="p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs shadow flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 text-center"
                >
                  <span className="text-xl">📘</span>
                  <span>1. 演習規劃暨AAR報告</span>
                  <span className="text-[11px] font-normal text-blue-200">(呈報長官與歸檔完整版)</span>
                </button>
                <button
                  onClick={() => exportDocument('CE_HANDBOOK')}
                  className="p-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold text-xs shadow flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 text-center"
                >
                  <span className="text-xl">📕</span>
                  <span>2. 控制官與評估手冊</span>
                  <span className="text-[11px] font-normal text-red-200">(含機密警示與打分卡)</span>
                </button>
                <button
                  onClick={() => exportDocument('SYMPTOM_CARDS')}
                  className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 text-center"
                >
                  <span className="text-xl">🪪</span>
                  <span>3. 傷患疾病症狀卡</span>
                  <span className="text-[11px] font-normal text-rose-100">(發給臨演與假人掛牌用)</span>
                </button>
                <button
                  onClick={() => exportDocument('HOTWASH')}
                  className="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 text-center"
                >
                  <span className="text-xl">📗</span>
                  <span>4. Hotwash 回饋問卷</span>
                  <span className="text-[11px] font-normal text-emerald-200">(演練後30分鐘內發放)</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 font-sans p-3 md:p-6 relative">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-700 text-sm font-bold animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* 人員權責總表彈窗 */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">👥 全階段人員權責分工與籌備時程總表</h3>
                <p className="text-xs text-slate-300">可隨時在此修改各角色負責人員姓名與各階段預定日期，系統會即時同步至所有步驟與匯出報告。</p>
              </div>
              <button onClick={() => setShowRosterModal(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded font-bold text-sm">
                ✕ 關閉
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-6">
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">📅 六大籌備階段主責人與預定日期總覽</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {STEPS.map((st, idx) => {
                    const assign = formData.stageAssignments?.[idx] || { owner: '', dueDate: '', notes: '' };
                    return (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                        <div className="font-bold text-blue-900">{st.title}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            className="p-1.5 border rounded bg-white text-gray-900"
                            placeholder="主責人員姓名"
                            value={assign.owner}
                            onChange={(e) => updateStageAssignment(idx, 'owner', e.target.value)}
                          />
                          <input
                            type="text"
                            className="p-1.5 border rounded bg-white text-gray-900"
                            placeholder="預定日期"
                            value={assign.dueDate}
                            onChange={(e) => updateStageAssignment(idx, 'dueDate', e.target.value)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-2">🎖️ T-DEEP / HSEEP 演習組織架構人員名冊</h4>
                {renderRosterPanel()}
              </div>
            </div>
            <div className="bg-gray-100 px-5 py-3 border-t flex justify-end">
              <button onClick={() => setShowRosterModal(false)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm">
                確認並返回規劃
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* 左側導航欄 */}
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h1 className="text-2xl font-bold text-white tracking-wider">T-DEEP 4.0</h1>
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-bold">規劃＋訓練整合版</span>
            </div>
            <p className="text-gray-300 text-xs mb-3">臺北市災害演習規劃與評估導航系統</p>

            {/* 模式切換器 */}
            <div className="grid grid-cols-2 gap-1.5 bg-gray-800 p-1.5 rounded-xl border border-gray-700 mb-3">
              <button
                onClick={() => setAppMode('PLANNER')}
                className={`py-2 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                  appMode === 'PLANNER' ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>📋</span>
                <span>演習規劃導航</span>
              </button>
              <button
                onClick={() => setAppMode('TRAINING')}
                className={`py-2 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                  appMode === 'TRAINING' ? 'bg-amber-500 text-gray-950 shadow' : 'text-amber-300 hover:bg-gray-700'
                }`}
              >
                <span>🎓</span>
                <span>角色任務訓練</span>
              </button>
            </div>

            <button
              onClick={() => setShowRosterModal(true)}
              className="w-full mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-2.5 px-3 rounded-lg shadow-md text-xs flex items-center justify-between border border-indigo-400 transition-transform active:scale-95"
            >
              <span className="flex items-center gap-2"><span className="text-base">👥</span><span>全階段人員權責與預定總表</span></span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">點擊指派</span>
            </button>

            {/* 範例載入區 */}
            <div className="mb-6 space-y-2.5 bg-gray-800 p-3.5 rounded-lg border border-gray-700">
              <p className="text-white font-bold text-xs mb-1 flex items-center justify-between">
                <span>📥 快速載入實戰範例</span>
                <span className="text-emerald-400 text-[11px]">● 已啟用自動暫存</span>
              </p>

              <button onClick={loadICUScenario} className="w-full bg-white hover:bg-blue-50 text-blue-900 font-bold py-2 px-3 rounded transition-colors text-xs flex items-center justify-start gap-2 shadow border-l-4 border-blue-500">
                <span className="text-base">🏥</span>
                <span>範例一：醫院加護病房火災</span>
              </button>

              <button onClick={loadKTVScenario} className="w-full bg-white hover:bg-purple-50 text-purple-900 font-bold py-2 px-3 rounded transition-colors text-xs flex items-center justify-start gap-2 shadow border-l-4 border-purple-500">
                <span className="text-base">🎤</span>
                <span>範例二：高層KTV與商場火災</span>
              </button>

              <button onClick={loadZhenxingScenario} className="w-full bg-white hover:bg-red-50 text-red-900 font-bold py-2 px-3 rounded transition-colors text-xs flex items-center justify-start gap-2 shadow border-l-4 border-red-500">
                <span className="text-base">🚨</span>
                <span>範例三：振興醫院複合災害演練</span>
              </button>

              <div className="pt-2 mt-2 border-t border-gray-700 flex gap-2">
                {!confirmClear ? (
                  <button onClick={() => setConfirmClear(true)} className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1.5 px-2 rounded transition-colors text-xs flex items-center justify-center gap-1 border border-gray-500">
                    <span>🧹</span><span>清空重填</span>
                  </button>
                ) : (
                  <div className="w-1/2 flex gap-1">
                    <button onClick={executeClearForm} className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-1 rounded text-[11px]">確定</button>
                    <button onClick={() => setConfirmClear(false)} className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-1.5 px-1 rounded text-[11px]">取消</button>
                  </div>
                )}
                <button onClick={saveProjectJson} className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1.5 px-2 rounded transition-colors text-xs flex items-center justify-center gap-1 border border-gray-500" title="下載JSON專案檔">
                  <span>💾</span><span>備份專案</span>
                </button>
              </div>
              <div className="pt-1">
                <label className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-2 rounded cursor-pointer text-[11px] flex items-center justify-center border border-dashed border-gray-600">
                  <span>📂 點此載入先前備份的 .json 專案檔</span>
                  <input type="file" accept=".json" onChange={loadProjectJson} className="hidden" />
                </label>
              </div>
            </div>

            {/* 六大步驟導航列 */}
            <div className="space-y-1.5">
              {STEPS.map((step, index) => {
                const stageOwner = formData.stageAssignments?.[index]?.owner;
                const isActiveStep = appMode === 'PLANNER' && currentStep === index;
                return (
                  <button
                    key={index}
                    onClick={() => { setAppMode('PLANNER'); setCurrentStep(index); }}
                    className={`w-full text-left p-2.5 rounded-lg transition-colors flex flex-col ${isActiveStep ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-[11px] font-bold ${isActiveStep ? 'text-blue-200' : 'text-gray-400'}`}>STEP {index + 1}</span>
                      <div className="flex gap-1">
                        {stageOwner && <span className="text-[10px] bg-slate-700/80 px-1.5 rounded text-amber-200 max-w-[90px] truncate">👤 {stageOwner}</span>}
                        {index === 1 && formData.objectivesList.length > 0 && <span className="text-[10px] bg-blue-800 px-1.5 rounded text-blue-100">{formData.objectivesList.length} 目標</span>}
                        {index === 3 && formData.mselList.length > 0 && <span className="text-[10px] bg-blue-800 px-1.5 rounded text-blue-100">{formData.mselList.length} 狀況</span>}
                      </div>
                    </div>
                    <span className={`text-sm font-bold truncate ${isActiveStep ? 'text-white' : 'text-gray-200'}`}>{step.title.split('：')[1] || step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-gray-700 text-[11px] text-gray-400 leading-relaxed">
            融合《臺北市 T-DEEP 指引》與《美國 HSEEP 方案》，內建全階段權責分工名冊、角色任務訓練中心與 5Why 評估分析。
          </div>
        </div>

        {/* 右側主內容區 */}
        <div className="w-full md:w-2/3 flex flex-col h-full min-h-[680px]">
          {appMode === 'TRAINING' ? (
            <>
              {renderTrainingCenter()}
              <div className="bg-gray-50 p-4 md:px-8 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setAppMode('PLANNER')}
                  className="px-5 py-2 rounded-md font-bold text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                >
                  ← 返回演習規劃步驟
                </button>
                <button
                  onClick={() => exportRoleBriefingCard(selectedTrainingRole)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md font-bold text-sm hover:bg-indigo-700 shadow-sm"
                >
                  🖨️ 下載本角色專屬簡報卡 (HTML)
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 md:p-8 flex-grow overflow-y-auto">
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{STEPS[currentStep].title}</h2>
                    <p className="text-base text-blue-600 font-bold mt-0.5">{STEPS[currentStep].subtitle}</p>
                  </div>
                </div>

                {renderStageOwnerBar(currentStep)}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md">
                    <h4 className="font-bold text-blue-900 text-xs mb-1">🎯 階段引導</h4>
                    <p className="text-xs text-blue-800 leading-relaxed">{STEPS[currentStep].guidance}</p>
                  </div>

                  <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-r-md">
                    <h4 className="font-bold text-emerald-900 text-xs mb-1">📄 應產出文件</h4>
                    <ul className="list-disc list-inside text-xs text-emerald-800 space-y-0.5">
                      {STEPS[currentStep].outputs.map((out, idx) => (
                        <li key={idx}>{out}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md">
                    <h4 className="font-bold text-amber-900 text-xs mb-1">💡 專家情境建議</h4>
                    <p className="text-xs text-amber-800 leading-relaxed">{STEPS[currentStep].scenarioTips}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                  {renderStepContent()}
                </div>
              </div>

              <div className="bg-gray-50 p-4 md:px-8 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 0}
                  className={`px-5 py-2 rounded-md font-bold text-sm transition-colors ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                >
                  ← 上一步
                </button>

                <div className="flex gap-2">
                  {currentStep < STEPS.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold text-sm hover:bg-blue-700 shadow-sm transition-colors"
                    >
                      下一步：{STEPS[currentStep + 1].title.split('：')[1]} →
                    </button>
                  ) : (
                    <button
                      onClick={() => exportDocument('PLAN')}
                      className="px-6 py-2 bg-green-600 text-white rounded-md font-bold text-sm hover:bg-green-700 shadow-sm transition-colors"
                    >
                      📘 快速匯出總規劃書
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TDEEPPlanner;