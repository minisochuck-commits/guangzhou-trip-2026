# Guangzhou Visit Guide · 三语接待行程演示

A mobile-first itinerary and visitor guide in Chinese, English and Arabic, with RTL layout, per-visitor links, daily plans, flight connections and offline reading.

这是从实际接待场景整理的早期项目。当前公开版本只使用 Guest 1–5 和 2026 年虚构行程；它不代表真实人员、航班预订、分房或公司活动。项目尚无经核实的外部使用规模，不声称已被广泛采用。

## 功能

- 中英阿三语，阿语从右至左显示。
- 按人筛选、日期跳转、相同安排合并、待确认事项和详情弹窗。
- 直飞与中转旅程、机场当地时间、可复制中文地址。
- 手机首页安装与离线阅读；更新演示时更换离线缓存版本。
- 广州城市、餐饮与文化指南及来源登记。

## 本地运行

Node.js 22.13 或更新版本：

```sh
npm run install:ci
npm run dev
```

打开 http://localhost:5173 。例如 `?p=guest5&lang=ar` 查看第五位演示访客的阿语行程，`?p=all` 查看全员。默认第五位访客、中文。人员筛选只是阅读功能，不提供访问隔离。

## 检查与静态构建

```sh
npm run check
npm run build
npm run start -- --port 8797
```

另一个终端执行 `node scripts/make-static.mjs http://127.0.0.1:8797 static`。将新生成的 `static/` 发布到静态托管；不要发布整个工作目录。脚本不会发布数据库、服务端环境或账号文件。

## 改成自己的行程

人员和航段在 `lib/trip-data.ts`，每日安排在 `lib/person-day-plan.ts`，表内摘要在 `lib/plan-presentation.ts`，界面翻译在 `lib/trip-i18n.ts`。示例活动资料在 `lib/meeting-guide.ts`。当前日期还用于展示层和测试；更换日期时必须同步修改，并运行完整检查。

公开演示中不要填真实姓名、手机号、票面姓名、订位编码、票号、护照资料、真实个人行程或内部通知。需要真实信息的版本请在私有部署维护。复制整个源代码到公共仓库前，连同文件、图片、旧版本和构建产物一起核查。

城市介绍保留带年份的公开资料，不能用作当前旅行预订、营业时间或服务可用性的保证。

## 贡献

欢迎报告可复现问题，特别是阿语排版、手机操作、离线更新和行程配置。请说明复现步骤、设备/浏览器和预期结果；示例或截图请使用虚构数据。修复前运行 `npm run check`，涉及界面的改动请附三语手机截图。暂无外部贡献或下载量的经核实统计。

## 许可边界

项目原创代码采用 [MIT 许可](LICENSE)。照片、商标及引文不属于该代码许可，见 `THIRD_PARTY_NOTICES.md`。图片有出处不代表获得了再分发许可。

开发约定见 `docs/GUEST_GUIDE.md`，本次脱敏决定见 `DESIGN_NOTES.md`。

## 源码与在线演示

在线演示：https://minisochuck-commits.github.io/guangzhou-trip-2026/ 。本仓 `codex/guangzhou-guest-source` 分支是源码，`main` 是静态构建产物。更新只做普通快进推送，不强推或重建历史。历史版本和旧 Sites 网址不随本次最新版本的脱敏更新；本次没有清除历史或改变仓库访问权限。
