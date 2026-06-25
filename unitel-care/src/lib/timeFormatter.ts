// ============ METHOD SUMMARY TABLE ============

/**
 * TIME FORMATTER - METHOD SUMMARY
 *
 * | #   | Method Name        | Description                                      | Example (69:20:53, 'en')               |
 * |-----|--------------------|--------------------------------------------------|----------------------------------------|
 * | 1   | formatTimeOnly()   | Basic HH:MM:SS format                            | "69:20:53"                             |
 * | 2   | formatWithUnits()  | Full format with unit names                      | "69 hours 20 minutes 53 seconds"       |
 * | 3   | formatShort()      | Abbreviated format (most compact)                | "69h 20m 53s"                          |
 * | 4   | formatWithDays()   | Format including days (when hours >= 24)         | "2 days 21 hours 20 minutes 53 seconds"|
 * | 5   | getAllFormats()    | Returns all formats for all languages            | Object with 4 langs × 4 formats        |
 *
 * QUICK USAGE GUIDE:
 * - For InfoRow component: value={TimeFormatter.formatShort(time, 'vi')}
 * - For headers/titles: TimeFormatter.formatWithUnits(time, 'en')
 * - For countdown display: TimeFormatter.formatTimeOnly(time)
 * - For long durations: TimeFormatter.formatWithDays(time, 'vi')
 * - For multi-language support: TimeFormatter.getAllFormats(time)
 *
 * SUPPORTED LANGUAGES:
 * - 'en': English
 * - 'lo': Lao (ພາສາລາວ)
 * - 'km': Khmer (ភាសាខ្មែរ)
 * - 'vi': Vietnamese (Tiếng Việt)
 */

// types.ts
export interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
}

export type LanguageCode = 'en' | 'lo' | 'km' | 'vi';

// timeFormatter.ts
/**
 * Professional time formatting utility with multi-language support
 *
 * @example
 * // Quick formatting
 * TimeFormatter.formatShort("69:20:53", 'vi') // "69h 20m 53s"
 * TimeFormatter.formatWithUnits("69:20:53", 'en') // "69 hours 20 minutes 53 seconds"
 * TimeFormatter.formatWithDays("69:20:53", 'vi') // "2 days 21 hours 20 minutes 53 seconds"
 */
export class TimeFormatter {
  private static readonly translations: Record<
    LanguageCode,
    {
      hours: string;
      minutes: string;
      seconds: string;
      separator: string;
    }
  > = {
    en: {
      hours: 'hour',
      minutes: 'minute',
      seconds: 'second',
      separator: ' ',
    },
    lo: {
      hours: 'ຊົ່ວໂມງ',
      minutes: 'ນາທີ',
      seconds: 'ວິນາທີ',
      separator: ' ',
    },
    km: {
      hours: 'ម៉ោង',
      minutes: 'នាទី',
      seconds: 'វិនាទី',
      separator: ' ',
    },
    vi: {
      hours: 'giờ',
      minutes: 'phút',
      seconds: 'giây',
      separator: ' ',
    },
  };

  /**
   * Parses a time string "HH:MM:SS" into a TimeComponents object
   *
   * @param timeStr - Time string in "HH:MM:SS" format
   * @returns Object containing hours, minutes, and seconds
   * @throws {Error} If format is invalid or numbers are not valid
   *
   * @example
   * TimeFormatter.parseTimeString("69:20:53") // { hours: 69, minutes: 20, seconds: 53 }
   * TimeFormatter.parseTimeString("00:00:00") // { hours: 0, minutes: 0, seconds: 0 }
   */
  static parseTimeString(timeStr: string): TimeComponents {
    const parts = timeStr.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid time format. Expected "HH:MM:SS"');
    }

    const [hours, minutes, seconds] = parts.map((part) => {
      const num = parseInt(part, 10);
      if (isNaN(num)) {
        throw new Error(`Invalid number: ${part}`);
      }
      return num;
    });

    return { hours, minutes, seconds };
  }

  /**
   * Pads a number with leading zero to ensure 2 digits
   *
   * @param num - Number to pad
   * @returns Padded string with leading zero if needed
   *
   * @example
   * TimeFormatter.padNumber(5) // "05"
   * TimeFormatter.padNumber(12) // "12"
   */
  private static padNumber(num: number): string {
    return String(num).padStart(2, '0');
  }

  /**
   * Adds plural 's' for English words based on count
   *
   * @param word - Word to pluralize (English only)
   * @param count - Count to determine singular/plural
   * @returns Pluralized word if count !== 1
   *
   * @example
   * TimeFormatter.pluralize('hour', 1) // "hour"
   * TimeFormatter.pluralize('hour', 2) // "hours"
   */
  private static pluralize(word: string, count: number): string {
    return count === 1 ? word : `${word}s`;
  }

  /**
   * [METHOD 1] Returns basic "HH:MM:SS" format without units
   *
   * @param timeStr - Time string in "HH:MM:SS" format
   * @returns Formatted time string with 2-digit padding
   *
   * @example
   * TimeFormatter.formatTimeOnly("69:20:53") // "69:20:53"
   * TimeFormatter.formatTimeOnly("5:5:5") // "05:05:05"
   */
  static formatTimeOnly(timeStr: string): string {
    const { hours, minutes, seconds } = this.parseTimeString(timeStr);
    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  /**
   * [METHOD 2] Returns formatted time with full unit names based on language
   *
   * @param timeStr - Time string in "HH:MM:SS" format
   * @param language - Language code ('en', 'lo', 'km', 'vi')
   * @returns Formatted time string with unit names
   *
   * @example
   * TimeFormatter.formatWithUnits("69:20:53", 'en') // "69 hours 20 minutes 53 seconds"
   * TimeFormatter.formatWithUnits("69:20:53", 'vi') // "69 giờ 20 phút 53 giây"
   * TimeFormatter.formatWithUnits("69:20:53", 'lo') // "69 ຊົ່ວໂມງ 20 ນາທີ 53 ວິນາທີ"
   * TimeFormatter.formatWithUnits("69:20:53", 'km') // "69 ម៉ោង 20 នាទី 53 វិនាទី"
   * TimeFormatter.formatWithUnits("0:0:0", 'en') // "0 seconds"
   */
  static formatWithUnits(timeStr: string, language: LanguageCode): string {
    const { hours, minutes, seconds } = this.parseTimeString(timeStr);
    const t = this.translations[language];

    const parts: string[] = [];

    if (hours > 0) {
      const hourText = language === 'en' ? this.pluralize(t.hours, hours) : t.hours;
      parts.push(`${hours} ${hourText}`);
    }

    if (minutes > 0) {
      const minuteText = language === 'en' ? this.pluralize(t.minutes, minutes) : t.minutes;
      parts.push(`${minutes} ${minuteText}`);
    }

    if (seconds > 0) {
      const secondText = language === 'en' ? this.pluralize(t.seconds, seconds) : t.seconds;
      parts.push(`${seconds} ${secondText}`);
    }

    if (parts.length === 0) {
      const zeroText = language === 'en' ? 'seconds' : t.seconds;
      return `0 ${zeroText}`;
    }

    return parts.join(t.separator);
  }

  /**
   * [METHOD 3] Returns abbreviated/short format of the time
   *
   * @param timeStr - Time string in "HH:MM:SS" format
   * @param language - Language code ('en', 'lo', 'km', 'vi')
   * @returns Abbreviated time string
   *
   * @example
   * TimeFormatter.formatShort("69:20:53", 'en') // "69h 20m 53s"
   * TimeFormatter.formatShort("69:20:53", 'vi') // "69h 20m 53s"
   * TimeFormatter.formatShort("69:20:53", 'lo') // "69ຊ 20ນ 53ວ"
   * TimeFormatter.formatShort("69:20:53", 'km') // "69ម 20ន 53វ"
   * TimeFormatter.formatShort("0:0:53", 'vi') // "53s"
   */
  static formatShort(timeStr: string, language: LanguageCode): string {
    const { hours, minutes, seconds } = this.parseTimeString(timeStr);

    const shortForms: Record<LanguageCode, { h: string; m: string; s: string }> = {
      en: { h: 'h', m: 'm', s: 's' },
      lo: { h: 'ຊ', m: 'ນ', s: 'ວ' },
      km: { h: 'ម', m: 'ន', s: 'វ' },
      vi: { h: 'h', m: 'm', s: 's' },
    };

    const short = shortForms[language];
    const parts: string[] = [];

    if (hours > 0) parts.push(`${hours}${short.h}`);
    if (minutes > 0) parts.push(`${minutes}${short.m}`);
    if (seconds > 0) parts.push(`${seconds}${short.s}`);

    return parts.join(' ');
  }

  /**
   * [METHOD 4] Returns formatted time with days included (if hours >= 24)
   *
   * @param timeStr - Time string in "HH:MM:SS" format
   * @param language - Language code ('en', 'lo', 'km', 'vi')
   * @returns Time string that may include days
   *
   * @example
   * TimeFormatter.formatWithDays("69:20:53", 'en') // "2 days 21 hours 20 minutes 53 seconds"
   * TimeFormatter.formatWithDays("69:20:53", 'vi') // "2 ngày 21 giờ 20 phút 53 giây"
   * TimeFormatter.formatWithDays("69:20:53", 'lo') // "2 ມື້ 21 ຊົ່ວໂມງ 20 ນາທີ 53 ວິນາທີ"
   * TimeFormatter.formatWithDays("69:20:53", 'km') // "2 ថ្ងៃ 21 ម៉ោង 20 នាទី 53 វិនាទី"
   * TimeFormatter.formatWithDays("25:00:00", 'en') // "1 day 1 hour"
   * TimeFormatter.formatWithDays("48:00:00", 'vi') // "2 days"
   */
  static formatWithDays(timeStr: string, language: LanguageCode): string {
    const { hours, minutes, seconds } = this.parseTimeString(timeStr);

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    const dayTranslations: Record<LanguageCode, string> = {
      en: 'day',
      lo: 'ມື້',
      km: 'ថ្ងៃ',
      vi: 'ngày',
    };

    const t = this.translations[language];
    const dayWord = dayTranslations[language];

    const parts: string[] = [];

    if (days > 0) {
      const dayText = language === 'en' ? this.pluralize(dayWord, days) : dayWord;
      parts.push(`${days} ${dayText}`);
    }

    if (remainingHours > 0) {
      const hourText = language === 'en' ? this.pluralize(t.hours, remainingHours) : t.hours;
      parts.push(`${remainingHours} ${hourText}`);
    }

    if (minutes > 0) {
      const minuteText = language === 'en' ? this.pluralize(t.minutes, minutes) : t.minutes;
      parts.push(`${minutes} ${minuteText}`);
    }

    if (seconds > 0) {
      const secondText = language === 'en' ? this.pluralize(t.seconds, seconds) : t.seconds;
      parts.push(`${seconds} ${secondText}`);
    }

    return parts.join(t.separator);
  }

  static getAllFormats(timeStr: string): Record<
    LanguageCode,
    {
      timeOnly: string;
      withUnits: string;
      short: string;
      withDays: string;
    }
  > {
    const languages: LanguageCode[] = ['en', 'lo', 'km', 'vi'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = {} as Record<LanguageCode, any>;

    for (const lang of languages) {
      result[lang] = {
        timeOnly: this.formatTimeOnly(timeStr),
        withUnits: this.formatWithUnits(timeStr, lang),
        short: this.formatShort(timeStr, lang),
        withDays: this.formatWithDays(timeStr, lang),
      };
    }

    return result;
  }
}
