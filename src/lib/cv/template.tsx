import { Document, Page, Text, View, Image, Link, StyleSheet } from '@react-pdf/renderer';
import type { CvDocument } from './mapper';

function formatAbsoluteUrl(url: string): string {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 70,
    paddingHorizontal: 48,
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    color: '#1f2937',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 6,
  },
  contactLine: {
    fontSize: 9.5,
    color: '#4b5563',
    marginBottom: 2,
  },
  link: {
    color: '#b50a0a',
    textDecoration: 'none',
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 18,
  },
  sectionBar: {
    backgroundColor: '#111827',
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 18,
  },
  block: {
    marginBottom: 10,
  },
  blockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  blockHeading: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
  },
  blockMeta: {
    fontSize: 9,
    color: '#6b7280',
  },
  blockSubheading: {
    fontSize: 9.5,
    color: '#4b5563',
    marginTop: 1,
  },
  bullet: {
    fontSize: 9.5,
    color: '#374151',
    marginTop: 2,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 9.5,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7.5,
    color: '#6b7280',
    maxWidth: 380,
    lineHeight: 1.4,
  },
  footerUrl: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
    marginBottom: 3,
  },
  qr: {
    width: 52,
    height: 52,
  },
});

export function CenterKickCvDocument({ cv, qrDataUrl, profileFullUrl }: { cv: CvDocument; qrDataUrl: string; profileFullUrl: string }) {
  const contactBits = [cv.email, cv.phone].filter(Boolean).join('  ·  ');

  return (
    <Document title={`${cv.name} - CenterKick CV`}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{cv.name.toUpperCase()}</Text>
          <Text style={styles.title}>{cv.title}</Text>
          {cv.socials.length > 0 ? (
            <Text style={styles.contactLine}>
              {cv.socials.map((s, i) => (
                <Text key={i}>
                  {i > 0 ? '  ·  ' : ''}
                  <Link src={formatAbsoluteUrl(s.value)} style={styles.link}>{s.label}</Link>
                </Text>
              ))}
            </Text>
          ) : null}
          {contactBits ? <Text style={styles.contactLine}>{contactBits}</Text> : null}
        </View>

        {cv.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionBar}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summary}>{cv.summary}</Text>
          </View>
        ) : null}

        {cv.sections.map((section, si) => (
          <View key={si} style={styles.section} wrap>
            <Text style={styles.sectionBar}>{section.label.toUpperCase()}</Text>
            {section.blocks.length === 0 ? (
              <Text style={styles.emptyText}>{section.emptyText || 'Nothing recorded yet.'}</Text>
            ) : (
              section.blocks.map((block, bi) => (
                <View key={bi} style={styles.block} wrap={false}>
                  <View style={styles.blockRow}>
                    <Text style={styles.blockHeading}>{block.heading}</Text>
                    {block.meta ? <Text style={styles.blockMeta}>{block.meta}</Text> : null}
                  </View>
                  {block.subheading ? <Text style={styles.blockSubheading}>{block.subheading}</Text> : null}
                  {(block.bullets || []).map((bullet, li) => (
                    <Text key={li} style={styles.bullet}>• {bullet}</Text>
                  ))}
                </View>
              ))
            )}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerUrl}>Profile Available on CenterKick</Text>
            <Text style={styles.footerUrl}><Link src={profileFullUrl} style={styles.link}>{profileFullUrl}</Link></Text>
            <Text style={styles.footerText}>
              CenterKick cannot be held liable for any false or inaccurate information on this CV — profile content is
              self-reported and managed solely by the account holder.
            </Text>
          </View>
          {qrDataUrl ? <Image src={qrDataUrl} style={styles.qr} /> : null}
        </View>
      </Page>
    </Document>
  );
}
