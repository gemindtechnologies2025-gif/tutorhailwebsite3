import React, { useEffect } from "react";
import { Layout } from "../../layout";
import TopBanner from "../../layout/Home/TopBanner";
import Categories from "../../layout/Home/categories";
import WhyChooseUs from "../../layout/Home/whyChooseUs";
import Testimonials from "../../layout/Home/Testimonials";
import SkillsTutors from "../../layout/Home/skills";
import Download from "../../layout/Home/download";
import QualifiedTutors from "../../layout/Home/qualifiedTopTutors";
import { getFromStorage } from "../../constants/storage";
import { STORAGE_KEYS } from "../../constants/storageKeys";

export default function Home() {
  const role=getFromStorage(STORAGE_KEYS.roleName)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Layout>
        <main className="content">
          <TopBanner />
          <Categories />
          {role=='tutor' ? null: (
          <QualifiedTutors />
          )}
          <WhyChooseUs />
          <SkillsTutors />
          <Testimonials />
          <Download />
        </main>
      </Layout>
    </>
  );
}
