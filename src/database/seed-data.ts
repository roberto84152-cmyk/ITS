import { LinkKind, SkillCategory } from '@prisma/client';

export const PROFILE_ID = '00000000-0000-4000-8000-000000000001';
export const AVATAR_KEY = 'avatars/profile.svg';

export const profileData = {
  name: 'Юсявичус Даниил',
  headline: 'Fullstack-разработчик · React Native / Node.js',
  description:
    'Разрабатываю мобильное приложение заказа такси полного цикла: React Native и Expo на клиенте, ' +
    'API на Deno/Hono и PostgreSQL на сервере, realtime-статусы заказов, карты и геолокация. ' +
    'Отвечаю за инфраструктуру, релизы в Google Play и App Store, мониторинг и стабильность сервисов. ' +
    'Параллельно делаю Telegram-ботов на Python (aiogram, Pyrogram) и интеграции с мессенджерами. ' +
    'Учусь в АКОТИБ по специальности «техник по компьютерным системам и комплексам». ' +
    'Готов уделять проекту 5–8 часов в день.',
  location: 'Удалённо',
  email: null,
  avatarKey: AVATAR_KEY,
};

export interface SeedLink {
  id: string;
  label: string;
  url: string;
  kind: LinkKind;
  sortOrder: number;
}

export const links: SeedLink[] = [
  {
    id: 'link-github',
    label: 'GitHub',
    url: 'https://github.com/roberto84152-cmyk',
    kind: LinkKind.GITHUB,
    sortOrder: 0,
  },
  {
    id: 'link-taxi-site',
    label: 'Сайт проекта Taxi Bars',
    url: 'https://taxibarsnz24.ru/',
    kind: LinkKind.WEBSITE,
    sortOrder: 1,
  },
  {
    id: 'link-taxi-app',
    label: 'Приложение Taxi Bars (Android / iOS)',
    url: 'https://taxibarsnz24.ru/smartlink.php',
    kind: LinkKind.WEBSITE,
    sortOrder: 2,
  },
];

export interface SeedSkill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  sortOrder: number;
}

export const skills: SeedSkill[] = [
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    category: SkillCategory.LANGUAGE,
    level: 5,
    sortOrder: 0,
  },
  {
    id: 'skill-javascript',
    name: 'JavaScript',
    category: SkillCategory.LANGUAGE,
    level: 4,
    sortOrder: 1,
  },
  { id: 'skill-python', name: 'Python', category: SkillCategory.LANGUAGE, level: 4, sortOrder: 2 },
  { id: 'skill-sql', name: 'SQL', category: SkillCategory.LANGUAGE, level: 4, sortOrder: 3 },
  {
    id: 'skill-react-native',
    name: 'React Native',
    category: SkillCategory.MOBILE,
    level: 5,
    sortOrder: 4,
  },
  { id: 'skill-expo', name: 'Expo', category: SkillCategory.MOBILE, level: 5, sortOrder: 5 },
  {
    id: 'skill-nodejs',
    name: 'Node.js',
    category: SkillCategory.FRAMEWORK,
    level: 4,
    sortOrder: 6,
  },
  { id: 'skill-deno', name: 'Deno', category: SkillCategory.FRAMEWORK, level: 4, sortOrder: 7 },
  { id: 'skill-hono', name: 'Hono', category: SkillCategory.FRAMEWORK, level: 4, sortOrder: 8 },
  { id: 'skill-nestjs', name: 'NestJS', category: SkillCategory.FRAMEWORK, level: 3, sortOrder: 9 },
  {
    id: 'skill-postgresql',
    name: 'PostgreSQL',
    category: SkillCategory.DATABASE,
    level: 4,
    sortOrder: 10,
  },
  { id: 'skill-prisma', name: 'Prisma', category: SkillCategory.DATABASE, level: 3, sortOrder: 11 },
  {
    id: 'skill-supabase',
    name: 'Supabase',
    category: SkillCategory.DATABASE,
    level: 4,
    sortOrder: 12,
  },
  { id: 'skill-docker', name: 'Docker', category: SkillCategory.DEVOPS, level: 4, sortOrder: 13 },
  { id: 'skill-nginx', name: 'nginx', category: SkillCategory.DEVOPS, level: 4, sortOrder: 14 },
  { id: 'skill-git', name: 'Git', category: SkillCategory.DEVOPS, level: 4, sortOrder: 15 },
  {
    id: 'skill-linux',
    name: 'Linux / Ubuntu',
    category: SkillCategory.DEVOPS,
    level: 4,
    sortOrder: 16,
  },
  { id: 'skill-aiogram', name: 'aiogram', category: SkillCategory.OTHER, level: 4, sortOrder: 17 },
  {
    id: 'skill-pyrogram',
    name: 'Pyrogram',
    category: SkillCategory.OTHER,
    level: 3,
    sortOrder: 18,
  },
  {
    id: 'skill-firebase',
    name: 'Firebase Cloud Messaging',
    category: SkillCategory.OTHER,
    level: 4,
    sortOrder: 19,
  },
];

export interface SeedExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  achievements: string[];
  sortOrder: number;
}

export const experience: SeedExperience[] = [
  {
    id: 'exp-taxi-bars',
    company: 'Taxi Bars NZCh',
    position: 'Fullstack-разработчик',
    startDate: '2024-11-01',
    endDate: null,
    isCurrent: true,
    achievements: [
      'Спроектировал и разработал мобильное приложение заказа такси на React Native + Expo для пассажиров и водителей — от идеи до релизов в Google Play и App Store.',
      'Реализовал realtime-сценарии: статусы заказа, движение автомобиля на карте у пассажира и доставку новых заказов водителям.',
      'Разработал backend на Deno/Hono + PostgreSQL: схема и миграции, приём заказов, расчёт стоимости, промокоды и бонусная система.',
      'Интегрировал Яндекс.Карты, геокодинг и геолокацию водителя, push-уведомления через FCM и OTA-обновления приложения.',
      'Настроил инфраструктуру: Docker, nginx, деплой и мониторинг серверов, health-check и автоперезапуск процессов.',
      'Покрыл юнит-тестами бизнес-логику (расчёт цены, промокоды, нормализация адресов) и smoke-тестами бэкенд перед деплоем.',
    ],
    sortOrder: 0,
  },
  {
    id: 'exp-bots',
    company: 'Проектная разработка',
    position: 'Backend-разработчик · Telegram / MAX боты',
    startDate: '2024-01-01',
    endDate: null,
    isCurrent: true,
    achievements: [
      'Разработал Telegram-ботов на aiogram с FSM-сценариями верификации и платёжными шлюзами.',
      'Интегрировал MAX через клиентский API и синхронизировал данные с мобильным приложением.',
      'Сделал юзербот для рассылок на Pyrogram и асинхронные webhook-сервисы на aiohttp.',
      'Настроил деплой на Ubuntu (PM2, scp) с локальными smoke-тестами и py_compile перед рестартом.',
    ],
    sortOrder: 1,
  },
];

export interface SeedProject {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  repoUrl: string | null;
  stack: string[];
  sortOrder: number;
}

export const projects: SeedProject[] = [
  {
    id: 'project-taxi-bars',
    name: 'Taxi Bars — заказ такси',
    description:
      'Мобильное приложение с клиентским и водительским режимами: карта, геокодинг, realtime-отслеживание автомобиля, чат и оценка поездки.',
    url: 'https://taxibarsnz24.ru/',
    repoUrl: null,
    stack: [
      'React Native',
      'Expo',
      'TypeScript',
      'Deno',
      'Hono',
      'PostgreSQL',
      'Supabase',
      'Docker',
      'nginx',
    ],
    sortOrder: 0,
  },
  {
    id: 'project-messenger-bots',
    name: 'Telegram / MAX боты',
    description:
      'Асинхронные боты и интеграции с мессенджерами: верификация, платежи, рассылки и синхронизация данных с приложением. Репозитории приватные.',
    url: null,
    repoUrl: null,
    stack: ['Python', 'aiogram', 'Pyrogram', 'aiohttp', 'SQLite', 'PM2'],
    sortOrder: 1,
  },
  {
    id: 'project-visit-card',
    name: 'Цифровая визитка (backend)',
    description:
      'Сервис цифровой визитки: NestJS, Prisma, GraphQL, PostgreSQL, S3-хранилище для аватара и Docker.',
    url: null,
    repoUrl: 'https://github.com/roberto84152-cmyk/ITS',
    stack: ['TypeScript', 'NestJS', 'Prisma', 'GraphQL', 'PostgreSQL', 'S3', 'Docker'],
    sortOrder: 2,
  },
];
