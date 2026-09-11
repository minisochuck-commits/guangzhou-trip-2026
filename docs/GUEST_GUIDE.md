# 广州接待指南：内容与交付

## 当前依据（2026-09-11 用户确认）

核心读者为 Citystars 品类招商负责人 Reham。此行的主线是参加 MINISO 会议、了解货盘与旗舰店型；自由时间的商圈与城市探索由客人选择。页面要体面、实用、有趣，不向客人暴露内部商业目的，不指导其写报告，也不把逛商圈与给予 MINISO 商业政策建立因果关系。MINISO 的规模与实力由会议现场介绍，网页不另添宣传章节。

保留已认可的默认 Reham、三列行程、正常大小写姓名和三语切换。指南先提供酒店地址/电话/接送联系，再列出发准备等实用内容。文化、城市规模、科技、美食与商圈按需展开。复用现有 Accordion、CopyChinese、SourceLink；正文至少 16px。以下决定替代 DESIGN_NOTES 中“城市长文必须展开”等旧指示。

## 数据边界

- 支付、打车、地图与上网指引必须在 Reham 视图可见；不能因内部员工安排而隐藏公共说明。
- Chuck 借给 Mohamed 的中国 SIM 与给 Ahmed/Mohamed 的备用金仅归该两人。Reham 的网络方案不假定由公司提供。
- 日程事实留在原有数据与派生函数中。本轮不更改航班、免费行李额、日期或分房安排。
- 科技介绍提供体验入口和确认方式；不能把未核实的酒店机器人服务、无人商店或飞行体验写成已经安排。
- 商圈路线是游览顺序示意，明确不是地理地图。两商圈分开安排，提供中文目的地；交通时间使用出发当天地图，不能靠示意图估算。
- 已撤销：埃及/广州经济强弱比较、全球仅六座美食之都、擎朗为广东公司、完全没有业态竞争、将历史传说与准确年代混写。

## 核实来源

- 支付、外卡、手机号注册、打车与通信准备：https://english.www.gov.cn/2025special/bizexpatsinchina2025
- 高德移动应用：https://m.amap.com/applink/appstore.html?schema=amapuri%3A%2F%2Frootmap%3FsourceApplication%3Dgrowth_guanwang
- 酒店地址与前台电话：https://www.ihg.com/intercontinental/hotels/cn/zh/guangzhou/canec/hoteldetail
- 天河城地址：https://ghzyj.gz.gov.cn/ywpd/slgsnew/content/post_10332177.html
- 太古汇地址、石牌桥站连接：https://www.taikoohui.com/en/about-us/about-us/contact-us
- 顺德与2014年入选：https://www.unesco.org/en/creative-cities/shunde
- 无人驾驶服务：https://www.weride.ai/services
- 酒店机器人能力（不是洲际安装证明）：https://www.pudurobotics.com/en/solutions/hospitality

## 源码与发布

用户本次指定的网页为 https://minisochuck-commits.github.io/guangzhou-trip-2026/ 。该仓 main 是静态生成物。源码基线为本地 83193d0；它的构建分包 trip-view-BWWt0mWU.js 与 GitHub 已发布 2c3e8cc 的同名分包 SHA256 一致：d4a13ac9883bd7ae398c680239349f5a21be3570e41b6bb2bc5f0ec7ba878f62。

本轮 Sites get_site 与凭证刷新均返回 project_not_found，未修改 Sites 身份、权限或已有站点。源码保存在同一 GitHub 仓的 codex/guangzhou-guest-source 分支，静态文件从源码构建后更新 main，普通快进推送，禁止旧 deploy-pages.sh 的强推重建历史方式。

构建：npm run build。启动生产预览 npm run start -- --port 8797，执行 node scripts/make-static.mjs http://127.0.0.1:8797 static。静态发布目录仅同步 static 中的产物；不得发布 node_modules、构建服务端配置或凭证。版本对应关系写入静态目录 source-version.json。

验证：npx tsc --noEmit、npm run lint、node scripts/check-guest-guide.mjs、node scripts/check-journeys.mjs、node scripts/check-noise.mjs。随后在真实浏览器检查 390px 中文/英文/阿语、Reham 与员工视图、折叠、复制和图片；发布后核 GitHub Pages build commit 并复查线上。
