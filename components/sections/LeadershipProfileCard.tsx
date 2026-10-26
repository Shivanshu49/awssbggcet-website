'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { TeamMember } from '@/components/cards/TeamCard';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import styles from './LeadershipProfileCard.module.css';

export function LeadershipProfileCard({ member }: { member: TeamMember }) {
  const groupLabel =
    member.group === 'lead'
      ? 'Leadership'
      : member.group === 'mentor'
        ? 'Mentor'
        : member.group === 'faculty'
          ? 'Faculty Advisor'
          : 'Core Team';
  const profileLinks = [
    { label: 'LinkedIn', href: member.linkedin },
    { label: 'GitHub', href: member.github },
    ...(member.twitter ? [{ label: 'Twitter / X', href: member.twitter }] : []),
    ...(member.portfolioUrl
      ? [{ label: 'Portfolio', href: member.portfolioUrl }]
      : []),
  ].filter((link) => link.href);
  const initials = member.name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={styles.profileTrigger}
          aria-label={`View ${member.name}'s profile`}
        >
          <span className={styles.portrait}>
            {member.image ? (
              <Image
                src={member.image}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className={styles.image}
              />
            ) : (
              <span className={styles.initials} aria-hidden="true">
                {initials}
              </span>
            )}
          </span>
          <span className={styles.frontDetails}>
            <span className={styles.group}>{groupLabel}</span>
            <span className={styles.name}>{member.name}</span>
            <span className={styles.role}>{member.role}</span>
            <span className={styles.flipHint}>Click name to view profile</span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        className={styles.dialogContent}
        overlayClassName={styles.dialogOverlay}
        showCloseButton={false}
      >
        <motion.article
          className={styles.dialogCard}
          initial={{ opacity: 0, scale: 0.76, y: 42, rotateX: -9 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 24, mass: 0.8 }}
          style={{ transformPerspective: 1200 }}
        >
          <DialogClose className={styles.closeButton} aria-label="Close profile">
            <X className="size-5" aria-hidden="true" />
          </DialogClose>

          <div className={styles.dialogProfile}>
            <div className={styles.dialogPortrait}>
              {member.image ? (
                <Image
                  src={member.image}
                  alt={`${member.name}`}
                  fill
                  sizes="(max-width: 640px) 40vw, 220px"
                  className={styles.image}
                />
              ) : (
                <span className={styles.dialogInitials} aria-hidden="true">
                  {initials}
                </span>
              )}
            </div>
            <span className={styles.dialogGroup}>{groupLabel}</span>
            <p className={styles.dialogRole}>{member.role}</p>
          </div>

          <div className={styles.dialogDetails}>
            <span className={styles.dialogEyebrow}>AWS Builder Center GCET</span>
            <DialogTitle className={styles.dialogName}>{member.name}</DialogTitle>
            <DialogDescription className={styles.dialogDescription}>
              {member.bio || `${member.role} at AWS Builder Center GCET.`}
            </DialogDescription>

            {member.achievements && member.achievements.length > 0 && (
              <section className={styles.achievementsSection}>
                <h3 className={styles.sectionLabel}>Key achievements</h3>
                <ul className={styles.achievements}>
                  {member.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </section>
            )}

            {profileLinks.length > 0 && (
              <nav className={styles.profileLinks} aria-label={`${member.name} social links`}>
                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </motion.article>
      </DialogContent>
    </Dialog>
  );
}
