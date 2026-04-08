/**
 * Mirrors backend {@link PaymentService.confirmUpgradeSubscriptionPayment} / perSeatUsd:
 * 3+ learner seats → groupAmount per seat; otherwise amount per seat.
 */

export type CourseRate = {
  amount?: number;
  groupAmount?: number;
  title?: string;
};


export function perSeatUsd(course: CourseRate, seatCountForGroupRule: number): number {
  const useGroup = seatCountForGroupRule >= 3;
  return useGroup ? Number(course.groupAmount) || 0 : Number(course.amount) || 0;
}

export type UpgradeSummaryLine =
  | {
      section: "new_courses";
      courseId: string;
      title: string;
      learners: number;
      perSeat: number;
      subtotal: number;
      tierLabel: string;
    }
  | {
      section: "new_seats";
      courseId: string;
      title: string;
      newSeats: number;
      perSeat: number;
      subtotal: number;
      tierLabel: string;
    };

export function tierLabelForSeatCount(seatCount: number): string {
  return seatCount >= 3 ? "Group rate (3+ learners)" : "Standard rate (1–2 learners)";
}

export function computeUpgradeSubscriptionPricing(params: {
  prevTotalLearners: number;
  newLearnersCount: number;
  existingCourseIds: string[];
  selectedNewCourseIds: string[];
  getCourse: (id: string) => CourseRate | undefined;
}): {
  total: number;
  uniqueNewCourseIds: string[];
  lines: UpgradeSummaryLine[];
  error?: string;
} {
  const { prevTotalLearners, newLearnersCount, existingCourseIds, selectedNewCourseIds, getCourse } = params;

  const existingSet = new Set(existingCourseIds.map(String));
  const uniqueNewCourses = [...new Set(selectedNewCourseIds.map(String))].filter((id) => id && !existingSet.has(id));

  if (uniqueNewCourses.length === 0 && newLearnersCount <= 0) {
    const error = "Upgrade your plan by adding new courses.";
    return { total: 0, uniqueNewCourseIds: [], lines: [], error };
  }

  const totalAfterUpgrade = prevTotalLearners + newLearnersCount;
  const onlyNewCourses = uniqueNewCourses.length > 0 && newLearnersCount === 0;
  const onlyNewLearners = uniqueNewCourses.length === 0 && newLearnersCount > 0;
  const both = uniqueNewCourses.length > 0 && newLearnersCount > 0;

  const lines: UpgradeSummaryLine[] = [];
  let total = 0;

  /** Subscriptions sometimes omit or zero totalLearners (e.g. individual); still charge at least one seat for new-course lines. */
  const seatsForNewCourseLines = Math.max(1, prevTotalLearners);

  if (onlyNewCourses) {
    for (const id of uniqueNewCourses) {
      const c = getCourse(id);
      if (!c) {
        return { total: 0, uniqueNewCourseIds: uniqueNewCourses, lines: [], error: "One or more new courses are missing from the catalog." };
      }
      const per = perSeatUsd(c, seatsForNewCourseLines);
      const subtotal = Math.round(seatsForNewCourseLines * per * 100) / 100;
      total += subtotal;
      lines.push({
        section: "new_courses",
        courseId: id,
        title: c.title ?? id,
        learners: seatsForNewCourseLines,
        perSeat: per,
        subtotal,
        tierLabel: tierLabelForSeatCount(seatsForNewCourseLines),
      });
    }
  } else if (onlyNewLearners) {
    if (existingCourseIds.length === 0) {
      return { total: 0, uniqueNewCourseIds: [], lines: [], error: "No courses on your subscription to extend." };
    }
    for (const id of existingCourseIds) {
      const c = getCourse(id);
      if (!c) {
        return { total: 0, uniqueNewCourseIds: [], lines: [], error: "Could not load pricing for a subscription course." };
      }
      const per = perSeatUsd(c, totalAfterUpgrade);
      const subtotal = Math.round(newLearnersCount * per * 100) / 100;
      total += subtotal;
      lines.push({
        section: "new_seats",
        courseId: id,
        title: c.title ?? id,
        newSeats: newLearnersCount,
        perSeat: per,
        subtotal,
        tierLabel: tierLabelForSeatCount(totalAfterUpgrade),
      });
    }
  } else if (both) {
    for (const id of uniqueNewCourses) {
      const c = getCourse(id);
      if (!c) {
        return { total: 0, uniqueNewCourseIds: uniqueNewCourses, lines: [], error: "One or more new courses are missing from the catalog." };
      }
      const per = perSeatUsd(c, seatsForNewCourseLines);
      const subtotal = Math.round(seatsForNewCourseLines * per * 100) / 100;
      total += subtotal;
      lines.push({
        section: "new_courses",
        courseId: id,
        title: c.title ?? id,
        learners: seatsForNewCourseLines,
        perSeat: per,
        subtotal,
        tierLabel: tierLabelForSeatCount(seatsForNewCourseLines),
      });
    }
    const mergedIds = [...new Set([...existingCourseIds.map(String), ...uniqueNewCourses])];
    for (const id of mergedIds) {
      const c = getCourse(id);
      if (!c) {
        return { total: 0, uniqueNewCourseIds: uniqueNewCourses, lines: [], error: "Could not load pricing for an included course." };
      }
      const per = perSeatUsd(c, totalAfterUpgrade);
      const subtotal = Math.round(newLearnersCount * per * 100) / 100;
      total += subtotal;
      lines.push({
        section: "new_seats",
        courseId: id,
        title: c.title ?? id,
        newSeats: newLearnersCount,
        perSeat: per,
        subtotal,
        tierLabel: tierLabelForSeatCount(totalAfterUpgrade),
      });
    }
  }

  total = Math.round(total * 100) / 100;
  return { total, uniqueNewCourseIds: uniqueNewCourses, lines };
}
