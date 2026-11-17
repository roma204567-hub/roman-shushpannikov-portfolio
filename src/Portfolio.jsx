import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const RESUME_URL = "/Roman_Shushpannikov_AI_Creator_CV.pdf";
const RESUME_NAME = "Шушпанников_Роман_резюме.pdf";

function DownloadIcon() {
  return (
    <svg
      className="download-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

const skillGroups = [
  {
    title: "AI-видео",
    tools: ["Kling", "Higgsfield", "Minimax", "Veo", "Runway", "Sora"],
    suffix: "и другие",
  },
  {
    title: "AI-изображения",
    tools: ["ChatGPT", "Nano Banana", "Midjourney"],
  },
  {
    title: "LLM",
    tools: ["ChatGPT", "Claude", "Gemini"],
    suffix: "и другие",
  },
  { title: "Монтаж", tools: ["CapCut"] },
  {
    title: "Технические инструменты",
    tools: ["Python", "aiogram", "FFmpeg", "Groq API", "Gemini API"],
  },
  { title: "Веб", tools: ["Craftum"] },
];

function SkillsIsland({ isOpen, setIsOpen }) {
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const skipFocusOpenRef = useRef(false);

  const canHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const closeOnPointerExit = () => {
    if (canHover()) setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        if (document.activeElement !== triggerRef.current) {
          skipFocusOpenRef.current = true;
          triggerRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        className="skl-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="skills-panel"
        onPointerEnter={() => {
          if (!canHover()) return;
          setIsOpen(true);
        }}
        onPointerLeave={closeOnPointerExit}
        onFocus={(event) => {
          if (skipFocusOpenRef.current) {
            skipFocusOpenRef.current = false;
            return;
          }
          if (event.target.matches(":focus-visible")) setIsOpen(true);
        }}
        onBlur={(event) => {
          if (!panelRef.current?.contains(event.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        onClick={(event) => {
          if (canHover() && event.detail !== 0) {
            setIsOpen(true);
            return;
          }
          setIsOpen((open) => !open);
        }}
      >
        Навыки
      </button>
      <div
        ref={panelRef}
        id="skills-panel"
        className="skl-panel"
        role="region"
        aria-label="Навыки"
        aria-hidden={!isOpen}
        onPointerLeave={closeOnPointerExit}
      >
        <div className="skl-content">
          {skillGroups.map(({ title, tools, suffix }) => (
            <section className="skl-section" key={title}>
              <h2 className="skl-title">{title}</h2>
              <div
                className="skl-chips"
                aria-label={`${tools.join(", ")}${suffix ? ` ${suffix}` : ""}`}
              >
                {tools.map((tool) => (
                  <span className="skl-chip" key={tool}>
                    {tool}
                  </span>
                ))}
                {suffix && <span className="skl-suffix">{suffix}</span>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

const withVideoMeta = (list) =>
  list.map((video, index) => ({
    ...video,
    title: `Ролик ${String(index + 1).padStart(2, "0")}`,
    src: `/video/${video.id}.mp4`,
    poster: `/images/${video.id}.webp`,
  }));

const videos = withVideoMeta([
  { id: "commission-01", duration: "15 сек." },
  { id: "commission-02", duration: "15 сек." },
  { id: "commission-03", duration: "9 сек." },
  { id: "commission-04", duration: "12 сек." },
  { id: "commission-05", duration: "15 сек." },
  { id: "commission-06", duration: "43 сек." },
]);

const freelanceVideos = withVideoMeta([
  { id: "freelance-01", duration: "33 сек." },
  { id: "freelance-02", duration: "26 сек." },
  { id: "freelance-03", duration: "28 сек." },
  { id: "freelance-04", duration: "10 сек." },
  { id: "freelance-05", duration: "15 сек." },
]);

const reusImages = Array.from({ length: 9 }, (_, index) => ({
  src: `/images/reus-0${index + 1}.jpg`,
  alt: `Слайд ${index + 1} карусели для Reus`,
}));

const commissionImages = [
  {
    src: "/images/commission-design-01.webp",
    alt: "Визуал кампании «Твой первый голос»",
  },
  {
    src: "/images/commission-design-02.webp",
    alt: "Приглашение на выборы с маскотом кампании",
  },
];

const thermaImages = [
  {
    src: "/images/therma.jpg",
    alt: "Дизайн публикации с расписанием работы терм Наутико",
  },
];

const alieKateraWebsite = {
  name: "Сайт «Алые катера»",
  url: "https://aliekatera.ru/",
  budget: "5 000 ₽",
  description:
    "Сайт для сервиса проката катеров в Пскове на Craftum: адаптация готового шаблона, доработка отдельных секций в Zero Block, подключение домена и настройка в Вебмастере.",
};

const projects = [
  {
    id: "reus",
    tabName: "Reus Commerce",
    name: "Reus Commerce",
    category: "Работа в команде",
    description: "AI-контент и сторителлинг для социальных сетей.",
    videos: [],
    design: {
      title: "TikTok-карусель",
      description: "Сценарии и визуалы для серийных публикаций.",
      images: reusImages,
      isCarousel: true,
      carouselName: "Карусель 1",
      metrics: [
        { value: "16+", label: "публикаций за день" },
        { value: "1,2 млн", label: "просмотров в месяц" },
      ],
    },
  },
  {
    id: "commission",
    tabName: "Избирательная комиссия Псковской области",
    name: "Избирательная комиссия Псковской области",
    category: "Проект",
    description: "Короткие видео и визуальные материалы кампании.",
    videos,
    design: {
      title: "Визуалы кампании",
      description: "Макеты для кампании «Твой первый голос».",
      images: commissionImages,
    },
  },
  {
    id: "freelance",
    tabName: "Фриланс",
    name: "Фриланс",
    category: "Отдельные проекты",
    description: "Индивидуальные проекты по видео, дизайну и веб-разработке.",
    videos: freelanceVideos,
    website: alieKateraWebsite,
    design: {
      title: "Термы Наутико",
      description: "Публикация с расписанием работы городского курорта.",
      images: thermaImages,
    },
  },
];


/* ---------- hooks ---------- */

// Срабатывает один раз, когда элемент появился во вьюпорте.
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, seen];
}

// Измеряем ширину обоих состояний островка, чтобы анимировать width плавно.
function useIslandSize(islandRef) {
  const [islandReady, setIslandReady] = useState(false);

  useLayoutEffect(() => {
    const island = islandRef.current;
    if (!island) return undefined;
    const full = island.querySelector(".island-full");
    const mini = island.querySelector(".island-mini");

    const measure = () => {
      island.style.setProperty("--w-full", `${full.offsetWidth}px`);
      island.style.setProperty("--w-mini", `${mini.offsetWidth}px`);
    };

    measure();
    const frame = requestAnimationFrame(() => setIslandReady(true));
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(full);
    resizeObserver.observe(mini);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [islandRef]);

  return islandReady;
}

// Плавное появление блоков [data-reveal] при скролле.
function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

// Скользящий индикатор активной вкладки проекта.
function useTabIndicator(containerRef, activeId) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const measure = () => {
      const active = container.querySelector('[role="tab"][aria-selected="true"]');
      if (!active) return;
      container.style.setProperty("--ind-x", `${active.offsetLeft}px`);
      container.style.setProperty("--ind-y", `${active.offsetTop}px`);
      container.style.setProperty("--ind-w", `${active.offsetWidth}px`);
      container.style.setProperty("--ind-h", `${active.offsetHeight}px`);
    };

    measure();
    const frame = requestAnimationFrame(() =>
      container.classList.add("is-ready"),
    );
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [containerRef, activeId]);
}

function Gallery({ kind, count, label, children }) {
  const [ref, seen] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`media-gallery${seen ? " is-in" : ""}`}
      data-kind={kind}
      data-count={count}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
}

function updateCardPointer(event) {
  if (event.pointerType === "touch") return;

  const { currentTarget } = event;
  const bounds = currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  const horizontalTilt = (Math.min(1, Math.max(0, x)) - 0.5) * 2;
  const verticalTilt = (Math.min(1, Math.max(0, y)) - 0.5) * -2;

  currentTarget.style.setProperty("--pointer-x", `${x * 100}%`);
  currentTarget.style.setProperty("--pointer-y", `${y * 100}%`);
  currentTarget.style.setProperty("--tilt-x", `${horizontalTilt * 1.2}deg`);
  currentTarget.style.setProperty("--tilt-y", `${verticalTilt * 1.2}deg`);
}

function resetCardPointer(event) {
  event.currentTarget.style.removeProperty("--pointer-x");
  event.currentTarget.style.removeProperty("--pointer-y");
  event.currentTarget.style.removeProperty("--tilt-x");
  event.currentTarget.style.removeProperty("--tilt-y");
}

function handleTabKeyDown(event, _vertical, onSelect) {
  const tabs = Array.from(
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]'),
  );
  const currentIndex = tabs.indexOf(event.currentTarget);
  let nextIndex = currentIndex;

  if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else {
    return;
  }

  event.preventDefault();
  const nextTab = tabs[nextIndex];
  nextTab.focus();
  onSelect(nextTab.dataset.value);
}

function trapDialogFocus(event, dialog) {
  if (event.key !== "Tab" || !dialog) return;

  const focusable = Array.from(
    dialog.querySelectorAll(
      'button:not([disabled]), video[controls], a[href], [tabindex]:not([tabindex="-1"])',
    ),
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function VideoProject({ project }) {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const viewerRef = useRef(null);
  const openerRef = useRef(null);
  const projectVideos = project.videos;
  const video = projectVideos[selectedVideo];

  const selectVideo = (direction) => {
    setSelectedVideo(
      (current) =>
        (current + direction + projectVideos.length) % projectVideos.length,
    );
  };

  useEffect(() => {
    if (!isViewerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      trapDialogFocus(event, viewerRef.current);
      if (event.key === "Escape") setIsViewerOpen(false);
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key === "ArrowLeft") selectVideo(-1);
      if (event.key === "ArrowRight") selectVideo(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (!viewerRef.current?.isConnected) openerRef.current?.focus();
    };
  }, [isViewerOpen, projectVideos.length]);

  return (
    <article className="video-project">
      <Gallery
        kind="video"
        count={projectVideos.length}
        label="Ролики проекта"
      >
        {projectVideos.map((item, index) => (
          <button
            className="media-card"
            type="button"
            key={item.id}
            style={{ "--i": index }}
            aria-label={`Открыть ${item.title}, длительность ${item.duration}`}
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              setSelectedVideo(index);
              setIsViewerOpen(true);
            }}
          >
            <span className="media-thumb" style={{ "--ar": "9 / 16" }}>
              <img
                src={item.poster}
                alt=""
                width="640"
                height="1138"
                loading="lazy"
                decoding="async"
              />
              <span className="play-badge" aria-hidden="true" />
            </span>
            <span className="media-meta">
              <strong>{item.title}</strong>
              <small>{item.duration}</small>
            </span>
          </button>
        ))}
      </Gallery>

      {isViewerOpen &&
        createPortal(
          <div
            ref={viewerRef}
            className="image-lightbox media-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={`Просмотр видео: ${video.title}`}
            onClick={(event) => {
              if (event.target === event.currentTarget)
                setIsViewerOpen(false);
            }}
          >
            <button
              className="lightbox-close"
              type="button"
              autoFocus
              onClick={() => setIsViewerOpen(false)}
            >
              Закрыть
            </button>
            {projectVideos.length > 1 && (
              <>
                <button
                  className="lightbox-navigation lightbox-previous"
                  type="button"
                  aria-label="Предыдущее видео"
                  onClick={() => selectVideo(-1)}
                >
                  ←
                </button>
                <p className="lightbox-counter" aria-live="polite">
                  {selectedVideo + 1} / {projectVideos.length}
                </p>
                <button
                  className="lightbox-navigation lightbox-next"
                  type="button"
                  aria-label="Следующее видео"
                  onClick={() => selectVideo(1)}
                >
                  →
                </button>
              </>
            )}
            <div className="video-lightbox-viewer">
              <video
                key={video.id}
                src={video.src}
                poster={video.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                aria-label={`${video.title}, проект ${project.name}`}
              />
              <p>{video.title} · {video.duration}</p>
            </div>
          </div>,
          document.body,
        )}
    </article>
  );
}

function ImageProject({ design }) {
  const { title, images, isCarousel = false, carouselName } = design;
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStart = useRef(null);
  const viewerRef = useRef(null);
  const openerRef = useRef(null);
  const image = images[selectedImage];

  const selectImage = (direction) => {
    setSelectedImage(
      (current) => (current + direction + images.length) % images.length,
    );
  };
  const handleTouchStart = (event) => {
    touchStart.current = event.changedTouches[0].clientX;
  };
  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (images.length > 1 && Math.abs(delta) > 48) {
      event.preventDefault();
      selectImage(delta < 0 ? 1 : -1);
    }
  };

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      trapDialogFocus(event, viewerRef.current);
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") selectImage(-1);
      if (event.key === "ArrowRight") selectImage(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (!viewerRef.current?.isConnected) openerRef.current?.focus();
    };
  }, [isLightboxOpen, images.length]);

  return (
    <article className="image-project">
      <Gallery
        kind={isCarousel ? "stack" : "design"}
        count={isCarousel ? 1 : images.length}
        label={`Материалы: ${title}`}
      >
        {(isCarousel ? [images[0]] : images).map((item, index) => {
          const itemTitle = isCarousel
            ? carouselName
            : images.length > 1
              ? `Слайд ${index + 1}`
              : title;
          const itemDescription = isCarousel
            ? `${images.length} слайдов`
            : "Открыть";

          return (
            <button
              className="media-card"
              type="button"
              key={item.src}
              style={{ "--i": index }}
              aria-label={
                isCarousel
                  ? `Открыть ${carouselName}, ${images.length} слайдов`
                  : `Открыть изображение «${item.alt}»`
              }
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setSelectedImage(index);
                setIsLightboxOpen(true);
              }}
            >
              {isCarousel ? (
                <span
                  className="media-thumb is-stack"
                  style={{ "--ar": "3 / 4" }}
                >
                  {images
                    .slice(0, 3)
                    .map((slide, layer) => (
                      <img
                        key={slide.src}
                        className={`stack-layer layer-${layer}`}
                        src={slide.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ))
                    .reverse()}
                </span>
              ) : (
                <span className="media-thumb" style={{ "--ar": "5 / 7" }}>
                  <img
                    src={item.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              )}
              <span className="media-meta">
                <strong>{itemTitle}</strong>
                <small>{itemDescription}</small>
              </span>
            </button>
          );
        })}
      </Gallery>

      {isLightboxOpen &&
        createPortal(
          <div
            ref={viewerRef}
            className="image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Просмотр изображений: ${title}`}
            onClick={(event) => {
              if (event.target === event.currentTarget)
                setIsLightboxOpen(false);
            }}
          >
            <button
              className="lightbox-close"
              type="button"
              autoFocus
              onClick={() => setIsLightboxOpen(false)}
            >
              Закрыть
            </button>
            {images.length > 1 && (
              <>
                <button
                  className="lightbox-navigation lightbox-previous"
                  type="button"
                  aria-label="Предыдущее фото"
                  onClick={() => selectImage(-1)}
                >
                  ←
                </button>
                <p className="lightbox-counter" aria-live="polite">
                  {selectedImage + 1} / {images.length}
                </p>
                <button
                  className="lightbox-navigation lightbox-next"
                  type="button"
                  aria-label="Следующее фото"
                  onClick={() => selectImage(1)}
                >
                  →
                </button>
              </>
            )}
            <div className="lightbox-viewer">
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              />
            </div>
          </div>,
          document.body,
        )}
    </article>
  );
}

function WebsiteProject({ website }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const viewerRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (!isPreviewOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      trapDialogFocus(event, viewerRef.current);
      if (event.key === "Escape") setIsPreviewOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (!viewerRef.current?.isConnected) openerRef.current?.focus();
    };
  }, [isPreviewOpen]);

  return (
    <article className="website-project">
      <Gallery kind="website" count={1} label={`Веб-разработка: ${website.name}`}>
        <div className="website-card-wrap">
          <button
            className="media-card website-card"
            type="button"
            style={{ "--i": 0 }}
            aria-label={`Открыть предпросмотр: ${website.name}`}
            aria-describedby="website-description-alie-katera"
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              setIsPreviewOpen(true);
            }}
          >
            <span className="media-thumb website-thumb" style={{ "--ar": "16 / 9" }}>
              <span className="website-browser-bar" aria-hidden="true">
                <span className="website-browser-dots"><i /><i /><i /></span>
                <span className="website-browser-address">aliekatera.ru</span>
                <span className="website-browser-spacer" />
              </span>
              {!isPreviewOpen && (
                <iframe
                  className="website-card-frame"
                  src={website.url}
                  title={`Миниатюра сайта ${website.name}`}
                  loading="lazy"
                  tabIndex="-1"
                  aria-hidden="true"
                />
              )}
              <span className="website-preview-cue" aria-hidden="true">
                Предпросмотр <span>↗</span>
              </span>
            </span>
            <span className="media-meta">
              <strong>{website.name}</strong>
              <small>Бюджет: {website.budget}</small>
            </span>
          </button>
          <aside
            id="website-description-alie-katera"
            className="website-description"
          >
            <p>{website.description}</p>
          </aside>
        </div>
      </Gallery>

      {isPreviewOpen &&
        createPortal(
          <div
            ref={viewerRef}
            className="image-lightbox website-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Предпросмотр: ${website.name}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsPreviewOpen(false);
            }}
          >
            <button
              className="lightbox-close"
              type="button"
              autoFocus
              onClick={() => setIsPreviewOpen(false)}
            >
              Закрыть
            </button>
            <a
              className="website-open-link"
              href={website.url}
              target="_blank"
              rel="noreferrer"
            >
              Открыть сайт ↗
            </a>
            <div className="website-viewer">
              <iframe
                src={website.url}
                title={`Предпросмотр сайта ${website.name}`}
                allow="fullscreen"
              />
            </div>
          </div>,
          document.body,
        )}
    </article>
  );
}

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState("commission");
  const [mediaType, setMediaType] = useState("video");
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const tabsRef = useRef(null);
  const islandRef = useRef(null);
  const project = projects.find((item) => item.id === selectedProjectId);

  // Единая точка выбора проекта: и клик, и стрелки на клавиатуре
  // (раньше стрелками менялся проект, но не менялся mediaType → пустая галерея).
  const selectProject = (id) => {
    const next = projects.find((item) => item.id === id);
    if (!next) return;
    setSelectedProjectId(id);
    setMediaType(
      next.videos.length ? "video" : next.website ? "website" : "design",
    );
  };

  const islandReady = useIslandSize(islandRef);
  useReveal();
  useTabIndicator(tabsRef, selectedProjectId);

  return (
    <>
      <header
        className={`site-island${islandReady ? " is-ready" : ""}${isProjectsOpen ? " is-collapsed" : ""}${isSkillsOpen ? " is-skills-open" : ""}`}
        ref={islandRef}
      >
        <div className="island-full">
          <a
            className="island-name"
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              setIsProjectsOpen(false);
              setIsSkillsOpen(false);
            }}
          >
            Роман Шушпанников
          </a>
          <SkillsIsland isOpen={isSkillsOpen} setIsOpen={setIsSkillsOpen} />
          <a
            className="island-cv"
            href={RESUME_URL}
            download={RESUME_NAME}
          >
            Резюме
            <DownloadIcon />
          </a>
        </div>
        <div className="island-mini">
          <a
            className="island-mark"
            href="#top"
            aria-label="Вернуться к началу"
            onClick={(event) => {
              event.preventDefault();
              setIsProjectsOpen(false);
              setIsSkillsOpen(false);
            }}
          >
            Наверх
          </a>
          <a
            className="island-download"
            href={RESUME_URL}
            download={RESUME_NAME}
            aria-label="Скачать резюме"
            title="Скачать резюме"
          >
            <DownloadIcon />
          </a>
        </div>
      </header>

      <main
        id="top"
        className={`site-stage${isProjectsOpen ? " is-projects-open" : ""}`}
      >
        <section className="hero section-wrap" inert={isProjectsOpen}>
          <div className="hero-copy">
            <h1>
              <span className="line hero-line-first">
                <span>Роман</span>
              </span>
              <span className="line hero-line-last">
                <span>Шушпанников</span>
              </span>
            </h1>
            <p className="hero-role">AI-креатор</p>
            <a
              className="hero-portfolio-link"
              href="#projects"
              aria-controls="projects"
              onClick={(event) => {
                event.preventDefault();
                setIsSkillsOpen(false);
                setIsProjectsOpen(true);
              }}
            >
              Портфолио
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="hero-portrait">
            <div className="portrait-art">
              <img
                src="/images/portrait-cutout.webp"
                alt="Роман Шушпанников в золотых очках"
                width="768"
                height="768"
              />
            </div>
          </figure>
        </section>

        <section
          className="portfolio section-wrap"
          id="projects"
          inert={!isProjectsOpen}
        >
          <div className="portfolio-heading" data-reveal>
            <h2>Проекты и опыт</h2>
          </div>

          <div
            className="project-tabs"
            ref={tabsRef}
            data-reveal
            role="tablist"
            aria-label="Проекты и места работы"
          >
            <span className="tab-indicator" aria-hidden="true" />
            {projects.map((item) => (
              <button
                type="button"
                role="tab"
                id={`${item.id}-project-tab`}
                data-value={item.id}
                tabIndex={selectedProjectId === item.id ? 0 : -1}
                key={item.id}
                className={selectedProjectId === item.id ? "is-active" : ""}
                aria-selected={selectedProjectId === item.id}
                aria-controls="project-content"
                onKeyDown={(event) =>
                  handleTabKeyDown(event, false, selectProject)
                }
                onPointerMove={updateCardPointer}
                onPointerLeave={resetCardPointer}
                onClick={() => selectProject(item.id)}
              >
                <span>{item.tabName}</span>
                <small>{item.category}</small>
              </button>
            ))}
          </div>

          <div
            className="project-content"
            data-reveal
            id="project-content"
            role="tabpanel"
            aria-labelledby={`${project.id}-project-tab`}
          >
            <div className="panel-body" key={project.id}>
              <div className="panel-head">
                {mediaType !== "website" && (
                  <p className="project-description">{project.description}</p>
                )}
                <div className="panel-aside">
                  {project.design.metrics && (
                    <div className="project-metrics">
                      {project.design.metrics.map((metric) => (
                        <p key={metric.value}>
                          <strong>{metric.value}</strong>
                          <span>{metric.label}</span>
                        </p>
                      ))}
                    </div>
                  )}
                  {project.videos.length > 0 && (
                    <div
                      className="media-tabs"
                      role="tablist"
                      aria-label={`Материалы проекта ${project.name}`}
                    >
                      <button
                        id="video-tab"
                        type="button"
                        role="tab"
                        aria-selected={mediaType === "video"}
                        aria-controls="project-media"
                        data-value="video"
                        tabIndex={mediaType === "video" ? 0 : -1}
                        onKeyDown={(event) =>
                          handleTabKeyDown(event, false, setMediaType)
                        }
                        onClick={() => setMediaType("video")}
                      >
                        Видео <span>{project.videos.length}</span>
                      </button>
                      <button
                        id="design-tab"
                        type="button"
                        role="tab"
                        aria-selected={mediaType === "design"}
                        aria-controls="project-media"
                        data-value="design"
                        tabIndex={mediaType === "design" ? 0 : -1}
                        onKeyDown={(event) =>
                          handleTabKeyDown(event, false, setMediaType)
                        }
                        onClick={() => setMediaType("design")}
                      >
                        Дизайн <span>{project.design.images.length}</span>
                      </button>
                      {project.website && (
                        <button
                          id="website-tab"
                          type="button"
                          role="tab"
                          aria-label="Веб-разработка"
                          aria-selected={mediaType === "website"}
                          aria-controls="project-media"
                          data-value="website"
                          tabIndex={mediaType === "website" ? 0 : -1}
                          onKeyDown={(event) =>
                            handleTabKeyDown(event, false, setMediaType)
                          }
                          onClick={() => setMediaType("website")}
                        >
                          <span className="media-tab-label-full">Веб-разработка</span>
                          <span className="media-tab-label-short">Веб</span>
                          <span>1</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="project-media"
                id="project-media"
                role={
                  project.videos.length || project.website
                    ? "tabpanel"
                    : undefined
                }
                aria-labelledby={
                  project.videos.length || project.website
                    ? `${mediaType}-tab`
                    : undefined
                }
              >
                {mediaType === "video" && project.videos.length ? (
                  <VideoProject key={`${project.id}-video`} project={project} />
                ) : mediaType === "website" && project.website ? (
                  <WebsiteProject
                    key={`${project.id}-website`}
                    website={project.website}
                  />
                ) : (
                  <ImageProject
                    key={`${project.id}-design`}
                    design={project.design}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
