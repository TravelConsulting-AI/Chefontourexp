import { useParams, Navigate } from 'react-router-dom';
import { MedellinToursPage } from './MedellinToursPage';
import { BuenosAiresToursPage } from './BuenosAiresToursPage';
import { ToursPage } from './ToursPage';
import { RioToursPage } from './RioToursPage';
import { PalermoToursPage } from './PalermoToursPage';
import { MalagaToursPage } from './MalagaToursPage';
import { IstanbulToursPage } from './IstanbulToursPage';
import { BeirutToursPage } from './BeirulToursPage';
import type { ComponentType } from 'react';

/**
 * Maps canonical_slug → existing editorial tour page component.
 * This is the single routing entry point for /experiences/:canonicalSlug.
 */
const TOUR_PAGES: Record<string, ComponentType> = {
    'medellin': MedellinToursPage,
    'buenos-aires': BuenosAiresToursPage,
    'barcelona': ToursPage,
    'rio': RioToursPage,
    'palermo': PalermoToursPage,
    'malaga': MalagaToursPage,
    'istanbul': IstanbulToursPage,
    'beirut': BeirutToursPage,
};

export function ExperienceRouter() {
    const { canonicalSlug } = useParams<{ canonicalSlug: string }>();

    if (!canonicalSlug || !TOUR_PAGES[canonicalSlug]) {
        return <Navigate to="/experiences" replace />;
    }

    const PageComponent = TOUR_PAGES[canonicalSlug];
    return <PageComponent />;
}
