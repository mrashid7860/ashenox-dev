import { Navigate, useParams } from 'react-router-dom';

import ProjectDetail from '@/pages/Portfolio/ProjectDetail';
import { projects } from '@/data/projectDetails.data';

export default function ProjectDetailPage() {
  const { slug } = useParams();

  console.log('URL slug:', slug);
  console.log('Projects:', projects);

  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  return <ProjectDetail project={project} />;
}
