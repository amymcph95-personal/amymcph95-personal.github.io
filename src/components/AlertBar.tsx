import { AVAILABILITY } from "../data/site";

/**
 * Figma "Nav" alert bar: a full-width pink strip with the availability date.
 * The date uses a deeper pink than Figma's #E91B9D so it passes WCAG AA (4.5:1)
 * on the #FFD6F0 background.
 */
export default function AlertBar() {
  return (
    <div className="bg-placeholder px-5 py-[14px] text-center sm:px-20" role="region" aria-label="Availability">
      <p className="t-alert text-ink">
        {AVAILABILITY.label}{" "}
        <span className="text-[#B8126F]">{AVAILABILITY.date}</span>
      </p>
    </div>
  );
}
