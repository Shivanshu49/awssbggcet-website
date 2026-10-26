'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { TeamMember } from '@/components/cards/TeamCard';
import styles from './LeadershipProfileCard.module.css';

export function LeadershipProfileCard({ member }: { member: TeamMember }) {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frontButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const showingBack = flipped || hovered || focused;
  const groupLabel = member.group === 'lead' ? 'Leadership' : 'Core Team';
  const profileLinks = [
    { label: 'LinkedIn', href: member.linkedin },
    { label: 'GitHub', href: member.github },
    ...(member.twitter ? [{ label: 'Twitter / X', href: member.twitter }] : []),
    ...(member.portfolioUrl
      ? [{ label: 'Portfolio', href: member.portfolioUrl }]
      : []),
  ].filter((link) => link.href);

  useEffect(
    () => () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    },
    [],
  );

  return (
    <article
      className={styles.card}
      data-flipped={showingBack}
      aria-label={`${member.name}, ${member.role}`}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          hoverTimerRef.current = setTimeout(() => setHovered(true), 120);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') {
          if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
          setHovered(false);
        }
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className={styles.cardInner}>
        <button
          ref={frontButtonRef}
          type="button"
          className={`${styles.face} ${styles.front}`}
          onClick={() => {
            setFlipped(true);
            requestAnimationFrame(() => backButtonRef.current?.focus());
          }}
          aria-label={`Show details for ${member.name}`}
          aria-pressed={showingBack}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
        >
          <span className={styles.portrait}>
            <Image
              src={member.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.image}
            />
          </span>
          <span className={styles.frontDetails}>
            <span className={styles.group}>{groupLabel}</span>
            <span className={styles.name}>{member.name}</span>
            <span className={styles.role}>{member.role}</span>
            <span className={styles.flipHint}>Tap or hover to view profile</span>
          </span>
        </button>

        <div className={`${styles.face} ${styles.back}`} aria-hidden={!showingBack}>
          <span className={styles.backEyebrow}>AWS Builder Center GCET</span>
          <h4 className={styles.backName}>{member.name}</h4>
          <p className={styles.backRole}>{member.role}</p>

          <section className={styles.bioSection} aria-label={`${member.name} bio`}>
            <h5 className={styles.sectionLabel}>About</h5>
            <p className={styles.bio}>
              {member.bio || 'Bio details have not been added yet.'}
            </p>
          </section>

          <section className={styles.achievementsSection} aria-label={`${member.name} achievements`}>
            <h5 className={styles.sectionLabel}>Key achievements</h5>
            {member.achievements && member.achievements.length > 0 ? (
              <ul className={styles.achievements}>
                {member.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.noLinks}>No achievements added yet.</p>
            )}
          </section>

          <dl className={styles.details}>
            <div>
              <dt>Team</dt>
              <dd>{groupLabel}</dd>
            </div>
            <div>
              <dt>Position</dt>
              <dd>{member.role}</dd>
            </div>
          </dl>

          <div className={styles.profileLinks}>
            <span className={styles.linksLabel}>Social links</span>
            {profileLinks.length > 0 ? (
              <div className={styles.links}>
                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={showingBack ? 0 : -1}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className={styles.noLinks}>No profile links provided yet.</p>
            )}
          </div>

          <button
            ref={backButtonRef}
            type="button"
            className={styles.backButton}
            onClick={() => {
              setFlipped(false);
              requestAnimationFrame(() => frontButtonRef.current?.focus());
            }}
            tabIndex={showingBack ? 0 : -1}
          >
            Show portrait
          </button>
        </div>
      </div>
    </article>
  );
}
