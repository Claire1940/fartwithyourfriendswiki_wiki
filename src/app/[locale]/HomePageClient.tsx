"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Ghost,
  LifeBuoy,
  Megaphone,
  PawPrint,
  Sailboat,
  Sparkles,
  Swords,
  Ticket,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// 模块头三件套：eyebrow 徽章 + LinkedTitle + subtitle/intro
function ModuleHeader({
  icon: Icon,
  data,
  linkData,
  locale,
}: {
  icon: LucideIcon;
  data: { eyebrow: string; title: string; subtitle: string; intro: string };
  linkData: { url: string; title: string } | null | undefined;
  locale: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4
                       bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]
                       text-xs font-medium uppercase tracking-wider
                       text-[hsl(var(--nav-theme-light))]"
      >
        <Icon className="h-4 w-4" />
        {data.eyebrow}
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <LinkedTitle linkData={linkData} locale={locale}>
          {data.title}
        </LinkedTitle>
      </h2>
      <p className="text-base md:text-lg font-medium text-foreground/90 max-w-3xl mx-auto mb-3">
        {data.subtitle}
      </p>
      <p className="text-sm md:text-base leading-6 text-muted-foreground max-w-3xl mx-auto">
        {data.intro}
      </p>
    </div>
  );
}

// 工具卡片标题 → section 锚点（顺序与 en.json tools.cards 一一对应）
const TOOL_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "game-modes",
  "multiplayer-guide",
  "rafts-guide",
  "animals-guide",
  "halloween-event",
  "updates-news",
];

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fartwithyourfriendswiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Fart With Your Friends Wiki",
        description:
          "Complete Fart With Your Friends Wiki covering codes, game modes, maps, rafts, animals, characters, updates, and beginner tips for the chaotic Roblox raft obby.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1600,
          height: 900,
          caption: "Fart With Your Friends - Chaotic Roblox Raft Obby",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Fart With Your Friends Wiki",
        alternateName: "FWYF Wiki",
        url: siteUrl,
        description:
          "Unofficial fan-made Fart With Your Friends wiki covering codes, modes, maps, rafts, animals, and updates for the Roblox raft game",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1600,
          height: 900,
          caption: "Fart With Your Friends Wiki - Roblox Raft Game",
        },
        sameAs: [
          "https://www.roblox.com/games/98875597274178/Fart-With-Your-Friends",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Fart With Your Friends",
        gamePlatform: ["PC", "Mac", "iOS", "Android", "Xbox One", "PlayStation 5"],
        applicationCategory: "Game",
        genre: ["Party", "Obby", "Multiplayer", "Casual"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/98875597274178/Fart-With-Your-Friends",
        },
      },
      {
        "@type": "VideoObject",
        name: "Kill Your Friends with FARTS in Roblox",
        description:
          "Fart With Your Friends gameplay video featuring chaotic multiplayer raft races and funny fart-powered river challenges in Roblox.",
        uploadDate: "2023-10-16",
        thumbnailUrl: "https://i.ytimg.com/vi/rfKcoz3R6r4/hqdefault.jpg",
        embedUrl: "https://www.youtube.com/embed/rfKcoz3R6r4",
        url: "https://www.youtube.com/watch?v=rfKcoz3R6r4",
      },
    ],
  };

  // Module 8 accordion state
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </aside> */}

      {/* 右侧广告容器 - Fixed 定位 */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/98875597274178/Fart-With-Your-Friends"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="rfKcoz3R6r4"
              title="Kill Your Friends with FARTS in Roblox"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_SECTION_IDS[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section（紧接 Tools Grid 之下） */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Fart With Your Friends Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Ticket}
            data={t.modules.fartWithYourFriendsCodes}
            linkData={moduleLinkMap["fartWithYourFriendsCodes"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.fartWithYourFriendsCodes.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <span className="inline-flex self-start items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] uppercase tracking-wider">
                    {card.status}
                  </span>
                  <h3 className="font-bold text-lg mt-3 mb-2 text-[hsl(var(--nav-theme-light))]">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[
                          `fartWithYourFriendsCodes::cards::${index}`
                        ]
                      }
                      locale={locale}
                    >
                      {card.name}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Fart With Your Friends Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={BookOpen}
            data={t.modules.fartWithYourFriendsBeginnerGuide}
            linkData={moduleLinkMap["fartWithYourFriendsBeginnerGuide"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.fartWithYourFriendsBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `fartWithYourFriendsBeginnerGuide::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                    <div className="mt-2 flex items-start gap-2">
                      <LifeBuoy className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="text-sm text-muted-foreground/90">
                        {step.tip}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Fart With Your Friends Game Modes */}
      <section id="game-modes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Swords}
            data={t.modules.fartWithYourFriendsGameModes}
            linkData={moduleLinkMap["fartWithYourFriendsGameModes"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.fartWithYourFriendsGameModes.modes.map(
              (m: any, index: number) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `fartWithYourFriendsGameModes::modes::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {m.mode}
                      </LinkedTitle>
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {m.playStyle}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {m.goal}
                  </p>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Users className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                    <span>{m.players}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/90">
                      Best for:{" "}
                    </span>
                    {m.bestFor}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Fart With Your Friends Multiplayer Guide */}
      <section
        id="multiplayer-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Users}
            data={t.modules.fartWithYourFriendsMultiplayerGuide}
            linkData={moduleLinkMap["fartWithYourFriendsMultiplayerGuide"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.fartWithYourFriendsMultiplayerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `fartWithYourFriendsMultiplayerGuide::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                    <div className="mt-2 flex items-start gap-2">
                      <LifeBuoy className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="text-sm text-muted-foreground/90">
                        {step.tip}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Team Size Reference Panel */}
          <div className="scroll-reveal mt-8 p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Swords className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">
                {t.modules.fartWithYourFriendsMultiplayerGuide.teamFormatsLabel}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {t.modules.fartWithYourFriendsMultiplayerGuide.teamFormats.map(
                (format: string, i: number) => (
                  <div
                    key={i}
                    className="p-4 bg-white/5 border border-border rounded-xl text-center"
                  >
                    <p className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                      {format}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Module 5: Fart With Your Friends Rafts Guide */}
      <section id="rafts-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Sailboat}
            data={t.modules.fartWithYourFriendsRaftsGuide}
            linkData={moduleLinkMap["fartWithYourFriendsRaftsGuide"]}
            locale={locale}
          />

          {/* Desktop comparison table */}
          <div className="scroll-reveal hidden md:block overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[1.2fr_1.4fr_1.2fr_1fr_1.3fr] bg-[hsl(var(--nav-theme)/0.15)]">
              {Object.values(
                t.modules.fartWithYourFriendsRaftsGuide.tableHeaders,
              ).map((header: any, i: number) => (
                <div
                  key={i}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]"
                >
                  {header}
                </div>
              ))}
            </div>
            {t.modules.fartWithYourFriendsRaftsGuide.rows.map(
              (row: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-[1.2fr_1.4fr_1.2fr_1fr_1.3fr] border-t border-border bg-white/5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="px-4 py-3 text-sm font-bold">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[
                          `fartWithYourFriendsRaftsGuide::rows::${index}`
                        ]
                      }
                      locale={locale}
                    >
                      {row.raft}
                    </LinkedTitle>
                  </div>
                  <div className="px-4 py-3 text-xs text-muted-foreground">
                    {row.theme}
                  </div>
                  <div className="px-4 py-3 text-xs text-muted-foreground">
                    {row.howToGet}
                  </div>
                  <div className="px-4 py-3 text-xs text-[hsl(var(--nav-theme-light))]">
                    {row.availability}
                  </div>
                  <div className="px-4 py-3 text-xs text-muted-foreground">
                    {row.note}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Mobile cards */}
          <div className="scroll-reveal md:hidden space-y-4">
            {t.modules.fartWithYourFriendsRaftsGuide.rows.map(
              (row: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl space-y-2"
                >
                  <h3 className="font-bold text-base">{row.raft}</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/90">Theme: </span>
                    {row.theme}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/90">How to get: </span>
                    {row.howToGet}
                  </p>
                  <p className="text-sm text-[hsl(var(--nav-theme-light))]">
                    {row.availability}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground/90">Note: </span>
                    {row.note}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Fart With Your Friends Animals Guide */}
      <section
        id="animals-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={PawPrint}
            data={t.modules.fartWithYourFriendsAnimalsGuide}
            linkData={moduleLinkMap["fartWithYourFriendsAnimalsGuide"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.fartWithYourFriendsAnimalsGuide.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <span className="inline-flex self-start items-center text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] uppercase tracking-wider mb-3">
                    {card.category}
                  </span>
                  <h3 className="font-bold text-lg mb-2">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[
                          `fartWithYourFriendsAnimalsGuide::cards::${index}`
                        ]
                      }
                      locale={locale}
                    >
                      {card.name}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {card.appearance}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-start gap-2 mb-2">
                      <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {card.unlockCondition}
                      </span>
                    </div>
                    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                      {card.limitedStatus}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Fart With Your Friends Halloween Event */}
      <section id="halloween-event" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Ghost}
            data={t.modules.fartWithYourFriendsHalloweenEvent}
            linkData={moduleLinkMap["fartWithYourFriendsHalloweenEvent"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.fartWithYourFriendsHalloweenEvent.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <span className="inline-flex self-start items-center text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] uppercase tracking-wider mb-3">
                    {card.type}
                  </span>
                  <h3 className="font-bold text-lg mb-2">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[
                          `fartWithYourFriendsHalloweenEvent::cards::${index}`
                        ]
                      }
                      locale={locale}
                    >
                      {card.name}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {card.description}
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {card.availability}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground/90">
                        {card.afterEvent}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 8: Fart With Your Friends Updates and Official News */}
      <section
        id="updates-news"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            icon={Megaphone}
            data={t.modules.fartWithYourFriendsUpdatesNews}
            linkData={moduleLinkMap["fartWithYourFriendsUpdatesNews"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-2">
            {t.modules.fartWithYourFriendsUpdatesNews.entries.map(
              (entry: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setUpdatesExpanded(
                        updatesExpanded === index ? null : index,
                      )
                    }
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-semibold">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `fartWithYourFriendsUpdatesNews::entries::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {entry.title}
                        </LinkedTitle>
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {entry.status}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${updatesExpanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {updatesExpanded === index && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground mb-3">
                        {entry.content}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {entry.topics.map((topic: string, ti: number) => (
                          <span
                            key={ti}
                            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border text-muted-foreground"
                          >
                            <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/98875597274178/Fart-With-Your-Friends"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
