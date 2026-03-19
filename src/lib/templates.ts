import type { HospitalSubmissionRequest, CommunitySubmissionRequest, SupplyItem } from '@/types';

/**
 * 格式化医院物资需求提交为 Telegram 通知文本
 * （对应原 main.go 的 suppliesSubmission 模板）
 */
export function formatHospitalSubmission(req: HospitalSubmissionRequest): string {
  const suppliesText = req.supplies
    .map(
      (s: SupplyItem) =>
        `  - 物资名称：${s.name}\n    数量单位：${s.unit}\n    需求数量：${s.need}\n    每日消耗：${s.daily}\n    库存数量：${s.have}\n    物资要求：${s.requirements}`
    )
    .join('\n');

  return `*新的物资需求提交*

- 医院名称：${req.name}
- 医院所在地区：${req.province} ${req.city} ${req.suburb}
- 医院详细地址：${req.address}
- 医院现每天接待患者数量：${req.patients ?? ''}
- 医院床位数：${req.beds ?? ''}
- 责任人姓名：${req.contactName ?? ''}
- 责任人所在单位或组织：${req.contactOrg}
- 责任人联系方式：${req.contactPhone}
- 物资需求列表：
${suppliesText}
- 可接受的捐物资渠道：${req.pathways}
- 现在的物流状况：${req.logisticStatus ?? ''}
- 需求信息数据来源：${req.source ?? ''}
- 需求的官方证明：${req.proof ?? ''}
- 其他备注：${req.notes ?? ''}`;
}

/**
 * 格式化社区物资需求提交为 Telegram 通知文本
 */
export function formatCommunitySubmission(req: CommunitySubmissionRequest): string {
  const medicalText = req.medicalSupplies?.map(
    (s: SupplyItem) => `  - 物资名称：${s.name}  需求：${s.need}${s.unit ?? ''}`
  ).join('\n') ?? '';

  const liveText = req.liveSupplies?.map(
    (s: SupplyItem) => `  - 物资名称：${s.name}  需求：${s.need}${s.unit ?? ''}`
  ).join('\n') ?? '';

  return `*新的社区物资需求提交*

- 姓名：${req.name}
- 年龄：${req.age}
- 所在地区：${req.province} ${req.city} ${req.suburb}
- 详细地址：${req.address}
- 联系电话：${req.contactPhone ?? ''}
- 代理人：${req.agentName ?? ''}（${req.agentContactPhone ?? ''}\uff09
- 需要车辆：${req.needsVehicle ? '是' : '否'}
${medicalText ? `- 医疗物资：\n${medicalText}` : ''}
${liveText ? `- 生活物资：\n${liveText}` : ''}
- 备注：${req.notes ?? ''}`;
}

/**
 * 格式化信息纠错请求为通知文本
 */
export function formatReport(type: string, cause: string, content: string): string {
  return `*新的网站信息纠错请求*

- 来源页面名称：${type}
- 信息纠错请求原因：${cause}
- 信息原数据：${content}`;
}
