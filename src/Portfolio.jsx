import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const videos = [
  { id: "commission-01", duration: "15 сек." },
  { id: "commission-02", duration: "15 сек." },
  { id: "commission-03", duration: "9 сек." },
  { id: "commission-04", duration: "12 сек." },
  { id: "commission-05", duration: "15 сек." },
  { id: "commission-06", duration: "43 сек." },
].map((video, index) => ({
  ...video,
  title: `Ролик ${String(index + 1).padStart(2, "0")}`,
  src: `/video/${video.id}.mp4`,
  poster: `/images/${video.id}.webp`,
}));

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
      description: "Макеты для кампании «Твой первый голос». ",
      images: commissionImages,
    },
  },
  {
    id: "freelance",
    tabName: "Фриланс",
    name: "Фриланс",
    category: "Отдельные проекты",
    description: "Индивидуальные задачи по видео и графическому дизайну.",
    videos: [],
    design: {
      title: "Термы Наутико",
      description: "Публикация с расписанием работы городского курорта.",
      images: thermaImages,
    },
  },
];

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

function handleTabKeyDown(event, vertical, onSelect) {
  const isVertical =
    vertical && !window.matchMedia("(max-width: 600px)").matches;
  const tabs = Array.from(
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]'),
  );
  const currentIndex = tabs.indexOf(event.currentTarget);
  let nextIndex = currentIndex;

  if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  } else if (
    event.key === (isVertical ? "ArrowDown" : "ArrowRight")
  ) {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (
    event.key === (isVertical ? "ArrowUp" : "ArrowLeft")
  ) {
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
      <div className="video-list media-gallery" aria-label="Ролики проекта">
        {projectVideos.map((item, index) => (
          <button
            className={`video-choice media-card ${selectedVideo === index ? "is-active" : ""}`}
            type="button"
            key={item.id}
            aria-pressed={selectedVideo === index}
            aria-label={`Открыть ${item.title}, длительность ${item.duration}`}
            onPointerMove={updateCardPointer}
            onPointerLeave={resetCardPointer}
            onClick={(event) => {
              openerRef.current = event.currentTarget;
              setSelectedVideo(index);
              setIsViewerOpen(true);
            }}
          >
            <img src={item.poster} alt="" loading="lazy" />
            <span>
              <strong>{item.title}</strong>
              <small className="choice-duration">{item.duration}</small>
            </span>
          </button>
        ))}
      </div>

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
      <div
        className="image-choice-list media-gallery"
        aria-label={`Материалы: ${title}`}
      >
        {(isCarousel ? [images[0]] : images).map((item, index) => {
          const itemTitle = isCarousel
            ? carouselName
            : images.length > 1
              ? `Слайд ${index + 1}`
              : title;
          const itemDescription = isCarousel
            ? `${images.length} слайдов`
            : "Открыть изображение";

          return (
            <button
              className="image-choice-card media-card"
              type="button"
              key={item.src}
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
              <img src={item.src} alt="" loading="lazy" />
              <span>
                <strong>{itemTitle}</strong>
                <small>{itemDescription}</small>
              </span>
            </button>
          );
        })}
      </div>

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

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState("commission");
  const [mediaType, setMediaType] = useState("video");
  const project = projects.find((item) => item.id === selectedProjectId);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });

    let frameId;
    const updateParallax = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        document.documentElement.style.setProperty(
          "--scroll-progress",
          String(scrollProgress),
        );

        document.querySelectorAll("[data-parallax]").forEach((element) => {
          const rect = element.getBoundingClientRect();
          const offset =
            (rect.top + rect.height / 2 - window.innerHeight / 2) *
            Number(element.dataset.parallax);
          element.style.setProperty("--parallax-y", `${offset}px`);
        });
      });
    };

    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
      cancelAnimationFrame(frameId);
    };
  }, [mediaType, selectedProjectId]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <a className="site-name" href="#top">
          Роман Шушпанников
        </a>
        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#projects">Проекты</a>
        </nav>
        <span className="header-location">Псков · удалённо</span>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy" data-reveal>
            <h1>
              Роман
              <br />
              Шушпанников
            </h1>
            <p className="hero-role">AI-креатор. Видео и визуальный контент.</p>
            <p className="hero-summary">
              Сценарий, генерация, съёмка и монтаж — от идеи до готовой
              публикации.
            </p>
            <a className="hero-link" href="#projects">
              Смотреть проекты
            </a>
          </div>
          <figure className="hero-portrait" data-reveal>
            <div className="portrait-art" data-parallax="0.045">
              <img src="/images/portrait-cutout.png" alt="Роман Шушпанников" />
            </div>
          </figure>
        </section>

        <section className="portfolio section-wrap" id="projects">
          <div className="portfolio-heading" data-reveal>
            <h2>Проекты и опыт</h2>
          </div>

          <div
            className="project-tabs"
            data-reveal
            role="tablist"
            aria-label="Проекты и места работы"
          >
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
                  handleTabKeyDown(event, true, setSelectedProjectId)
                }
                onPointerMove={updateCardPointer}
                onPointerLeave={resetCardPointer}
                onClick={() => {
                  setSelectedProjectId(item.id);
                  setMediaType(item.videos.length ? "video" : "design");
                }}
              >
                <span>{item.tabName}</span>
                <small>{item.category}</small>
              </button>
            ))}
          </div>

          <div
            className="project-content"
            id="project-content"
            role="tabpanel"
            aria-labelledby={`${project.id}-project-tab`}
          >
            <div className="work-summary">
              <p className="project-description">{project.description}</p>
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
            </div>

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
              </div>
            )}

            <div
              className="project-media"
              id="project-media"
              role={project.videos.length ? "tabpanel" : undefined}
              aria-labelledby={
                project.videos.length ? `${mediaType}-tab` : undefined
              }
            >
              {mediaType === "video" ? (
                <VideoProject key={`${project.id}-video`} project={project} />
              ) : (
                <ImageProject
                  key={`${project.id}-design`}
                  design={project.design}
                />
              )}
            </div>
          </div>
        </section>

      </main>
      <footer className="site-footer section-wrap">
        <span>Роман Шушпанников</span>
        <span>AI-креатор · Псков</span>
      </footer>
    </>
  );
}

export default App;
