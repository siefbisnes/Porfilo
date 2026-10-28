import type { ProjectDefinition } from './types';

/**
 * Portfolio projects live here once. This registry drives both the floating
 * project windows and the horizontal showcase. Add a real screenshot under
 * public/previews/ and set previewImage when one is ready.
 */
export const projects: ProjectDefinition[] = [
  {
    id: 'al-qemma-pos',
    previewimage: '/home/altf/Develpoment/sief-portfolio/Images/Screenshot From 2026-10-28 09-03-35.png',
    title: 'Al-Qemma POS',
    description:
      'My first point-of-sale application built for a real client. Al-Qemma brings inventory, sales, purchases, customers, warranties, expenses, and reporting together in a local-first shop system, with private remote access through Tailscale.',
    technologies: ['Python', 'Flask', 'SQLite', 'HTML5', 'CSS3', 'JavaScript', 'Jinja2', 'PyWebView', 'Playwright', 'PyInstaller', 'Tailscale', 'Batchfile', 'Inno Setup'],
    technologyComposition: [
      { name: 'Python', percentage: 63 },
      { name: 'HTML', percentage: 28.1 },
      { name: 'CSS', percentage: 4.3 },
      { name: 'JavaScript', percentage: 3 },
      { name: 'Batchfile', percentage: 0.5 },
      { name: 'Inno Setup', percentage: 0.4 },
    ],
    integrationType: 'preview',
    icon: '▦',
    accentColor: '#247a57',
    sourceCodeUrl: 'https://github.com/siefbisnes/Al-Qemmh-POS-APP',
    demoEnabled: false,
    initialSize: { width: 445, height: 300 },
    initialPosition: { x: 0.59, y: 0.06, relative: true },
    float: { enabled: true, durationSeconds: 8.8, rotationDegrees: 0.45 },
    translations: {
      title: { ja: 'Al-Qemma POS', ar: 'القمة POS' },
      description: {
        ja: '実際のクライアント向けに初めて開発したPOSアプリです。在庫、販売、仕入れ、顧客、保証、経費、レポートを管理し、Tailscaleによるプライベートなリモートアクセスにも対応します。',
        ar: 'أول تطبيق نقاط بيع أعمله لعميل حقيقي. بيدير المخزون والمبيعات والمشتريات والعملاء والضمانات والمصروفات والتقارير محليًا، مع إمكانية الوصول الخاص عن بُعد عبر Tailscale.',
      },
    },
    status: 'available',
    lazyLoad: true,
  },
  {
    id: 'panel',
    title: 'Panel',
    description:
      'An early Linux desktop companion that shows the evidence behind app detections, helps inspect declared configuration, and requests package actions through the existing package manager after confirmation. Distro coverage is still limited.',
    technologies: ['Python', 'GTK 4', 'YAML', 'Shell', 'Linux', 'pytest'],
    technologyComposition: [
      { name: 'Python', percentage: 99 },
      { name: 'Shell', percentage: 1 },
    ],
    integrationType: 'preview',
    icon: '⌘',
    accentColor: '#4169a1',
    sourceCodeUrl: 'https://github.com/siefbisnes/Panel',
    demoEnabled: false,
    initialSize: { width: 420, height: 290 },
    initialPosition: { x: 0.70, y: 0.25, relative: true },
    float: { enabled: true, durationSeconds: 9.6, rotationDegrees: 0.35 },
    translations: {
      title: { ja: 'Panel', ar: 'Panel' },
      description: {
        ja: 'Linux向けの初期プロトタイプです。アプリ検出の根拠を表示し、設定ファイルを確認して、既存のパッケージマネージャー経由で確認後に操作を依頼できます。対応ディストリビューションはまだ限られています。',
        ar: 'أداة تجريبية للينكس بتعرض الأدلة وراء اكتشاف التطبيقات، وتساعد في فحص الإعدادات، وطلب عمليات الحزم من خلال مدير الحزم بعد التأكيد. دعم التوزيعات ما زال محدودًا.',
      },
    },
    status: 'experimental',
    lazyLoad: true,
  },
  {
    id: 'mygit',
    title: 'Mygit',
    description: 'Under construction.',
    technologies: [],
    integrationType: 'preview',
    icon: 'M',
    accentColor: '#343a40',
    demoEnabled: false,
    initialSize: { width: 350, height: 230 },
    initialPosition: { x: 0.75, y: 0.07, relative: true },
    float: { enabled: true, durationSeconds: 10.2, rotationDegrees: 0.3 },
    translations: {
      title: { ja: 'Mygit', ar: 'Mygit' },
      description: { ja: '開発中です。', ar: 'قيد الإنشاء.' },
    },
    status: 'in-development',
    lazyLoad: true,
  },
  {
    id: 'brokerage',
    title: 'Brokerage',
    description:
      'A large real-estate brokerage platform in active development, bringing property and client management together with WhatsApp integration, webhooks, programmable tasks, workflow automation, and AI-assisted replies. The repository is private while a public release is being prepared.',
    technologies: ['Python', 'Flask', 'PostgreSQL', 'HTML', 'JavaScript', 'Node.js', 'WhatsApp WebJS', 'Webhooks', 'AI workflows'],
    technologyComposition: [
      { name: 'Python', percentage: 65 },
      { name: 'HTML', percentage: 25 },
      { name: 'Node.js + JavaScript', percentage: 10, color: 'linear-gradient(90deg, #539E43 0 50%, #F0DB4F 50% 100%)' },
    ],
    integrationType: 'preview',
    icon: '⌂',
    accentColor: '#6373c8',
    demoEnabled: false,
    previewimage: '/home/altf/Develpoment/sief-portfolio/Images/Screenshot 2026-10-28 at 09-06-55 Brokerage.png',
    initialSize: { width: 435, height: 300 },
    initialPosition: { x: 0.54, y: 0.48, relative: true },
    float: { enabled: true, durationSeconds: 9.1, rotationDegrees: 0.4 },
    translations: {
      title: { ja: 'Brokerage', ar: 'Brokerage' },
      description: {
        ja: '開発中の大規模な不動産仲介プラットフォームです。物件・顧客管理に加え、WhatsApp連携、Webhook、設定可能なタスク、ワークフロー自動化、AIによる返信支援を備えます。公開準備中のため、リポジトリは現在非公開です。',
        ar: 'منصة وساطة عقارية كبيرة قيد التطوير، بتجمع إدارة العقارات والعملاء مع تكامل واتساب وWebhooks والمهام القابلة للبرمجة وأتمتة سير العمل والردود المدعومة بالذكاء الاصطناعي. المستودع خاص حاليًا أثناء التحضير لإصدار عام.',
      },
    },
    status: 'in-development',
    lazyLoad: true,
  },
];

export function getProjectById(id: string): ProjectDefinition | undefined {
  return projects.find((project) => project.id === id);
}
