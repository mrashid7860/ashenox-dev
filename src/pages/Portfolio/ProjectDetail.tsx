import { Link } from 'react-router-dom';
import { useState } from 'react';

import type { Project } from '@/data/projectDetails.data';

type ProjectDetailProps = {
  project: Project;
};

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState(0);

  const currentTab = project.tabs[activeTab];

  return (
    <main className="relative w-full bg-[#171717] text-[#f5f5f3]">
      {/* ==========================================================
          PROJECT SECTION
      ========================================================== */}

      <div className="mx-auto w-full max-w-full px-4 md:px-10 lg:px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* ======================================================
              LEFT / PROJECT INFORMATION
              STAYS FIXED WHILE RIGHT CONTENT SCROLLS
              THEN MOVES WITH THE SECTION AT THE END
          ====================================================== */}

          <aside className="col-span-12 lg:col-span-5 xl:col-span-4">
            <div className="py-[65px] lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:py-[110px] xl:py-[110px] 2xl:py-[110px]">
              {/* ==================================================
                  TOP CONTENT
              ================================================== */}

              <div>
                {/* BACK */}

                <div className="absolute top-[70px] lg:top-[80px] lg:mb-0">
                  <Link to="/portfolio" className="group inline-flex text-[13px] leading-none tracking-[-0.02em]">
                    <span className="uppercase">Back to work</span>
                  </Link>
                </div>

                {/* LINE */}

                <div className="relative mb-5 mt-10 w-full border-b border-white/20 md:mb-8 md:mt-10 lg:block xl:mt-0 2xl:mt-0">
                  {/* <span className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border border-white/60 bg-[#171717]" /> */}
                </div>

                {/* TITLE */}

                <div>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h1 className="max-w-[500px] text-3xl font-normal leading-[0.95] tracking-[-0.05em] md:text-5xl lg:text-[28px]">{project.title}</h1>
                  </div>

                  {/* DESCRIPTION */}

                  <p className="max-w-[250px] text-[14px] leading-[1.2] text-white/60 md:text-[13px]">{project.description}</p>

                  {/* SERVICES */}

                  <ul className="mt-8 text-[13px] md:mt-8 md:space-y-[-5px] md:text-[13px]">
                    {project.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>

                {/* ==================================================
                    TABS
                ================================================== */}

                <div className="mt-12 lg:mt-16 xl:mb-16 2xl:mb-0">
                  {/* TAB NAVIGATION */}

                  <div className="flex flex-wrap gap-x-5 gap-y-3 border-white/10 pb-3">
                    {project.tabs.map((tab, index) => (
                      <button
                        key={tab.label}
                        type="button"
                        onClick={() => setActiveTab(index)}
                        className={`relative text-xs uppercase transition-opacity duration-300 md:text-[13px] ${activeTab === index ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                      >
                        {tab.label}

                        {activeTab === index && <span className="absolute -bottom-[10px] left-0 h-px w-full bg-[#f5f5f3]" />}
                      </button>
                    ))}
                  </div>

                  {/* TAB CONTENT */}

                  <div className="mt-3">
                    <div key={activeTab} className="animate-project-content text-[13px] leading-[1.2] text-white/60 md:w-[440px] md:text-[13px] lg:w-[440px] xl:w-[380px] 2xl:w-[440px]">
                      {Array.isArray(currentTab.content) ? (
                        <ul className="space-y-3">
                          {currentTab.content.map((item) => (
                            <li key={item} className="relative pl-4">
                              <span className="absolute left-0 top-[0.65em] h-1 w-1 rounded-full bg-white/50" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>{currentTab.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  DESKTOP NAVIGATION
              ================================================== */}

              <div className="mt-[120px] hidden border-t border-white/20 lg:block xl:pt-2 2xl:pt-2">
                <div className="flex items-center justify-between">
                  <Link to="/portfolio" className="text-sm uppercase transition-opacity hover:opacity-60">
                    Back to work
                  </Link>

                  <Link to="/portfolio" className="text-sm uppercase transition-opacity hover:opacity-60">
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* ======================================================
              RIGHT / PROJECT VISUALS
              NORMAL DOCUMENT SCROLL
          ====================================================== */}

          <section className="col-span-12 lg:col-start-6 lg:col-end-13 lg:pb-[100px] lg:pt-[110px] xl:col-start-5">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {project.images.map((image, index) => (
                <div key={`${image.src}-${index}`} className={`overflow-hidden rounded-[8px] ${image.size === 'half' ? 'col-span-2 sm:col-span-1' : 'col-span-2'}`}>
                  <img src={image.src} alt={image.alt ?? `${project.title} project image ${index + 1}`} className="block h-auto w-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ==========================================================
          MOBILE NAVIGATION
      ========================================================== */}

      <div className="sticky bottom-0 z-20 mt-10 border-t border-white/20 bg-[#171717]/95 px-6 py-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between">
          <Link to="/portfolio" className="text-sm">
            Back to work
          </Link>

          <Link to="/portfolio" className="text-sm">
            Next
          </Link>
        </div>
      </div>
    </main>
  );
}
