/**
 * Pricing calculation utilities
 * Handles pricing logic including discounts and revenue sharing
 */

export interface PricingOptions {
  type: 'image' | 'content';
  count?: number; // number of images or files
  wordCount?: number; // number of words
  fileSize?: number; // file size in bytes
}

export interface PricingResult {
  basePrice: number; // Original price before discount
  discountAmount: number; // Discount amount
  finalPrice: number; // Price after discount
  discountPercentage: number; // Discount percentage
  platformShare: number; // Platform's share (50%)
  agentShare: number; // Agent's share (50% of original)
  hasNoErrorsDiscount: boolean; // Whether 40% no-errors discount applied
}

/**
 * Calculate pricing based on image count
 */
function calculateImagePricing(count: number): number {
  if (count >= 100) {
    return 200; // ₹200 for 100+ images
  } else if (count >= 10) {
    return 30; // ₹30 for 10+ images
  } else {
    return count * 5; // ₹5 per image
  }
}

/**
 * Calculate pricing based on word count
 */
function calculateWordPricing(wordCount: number): number {
  if (wordCount <= 500) {
    return 10;
  } else if (wordCount <= 1000) {
    return 18;
  } else if (wordCount <= 2500) {
    return 40;
  } else if (wordCount <= 5000) {
    return 75;
  } else {
    // Custom quote for 5000+ words
    return Math.ceil(wordCount / 500) * 10; // Approximate: ₹10 per 500 words
  }
}

/**
 * Calculate pricing based on file size
 */
function calculateSizePricing(sizeInBytes: number): number {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  
  if (sizeInMB <= 5) {
    return 15;
  } else if (sizeInMB <= 10) {
    return 25;
  } else if (sizeInMB <= 20) {
    return 40;
  } else {
    // Custom quote for 20+ MB
    return Math.ceil(sizeInMB / 5) * 10; // Approximate
  }
}

/**
 * Calculate pricing for a job
 */
export function calculatePricing(options: PricingOptions, hasNoErrors: boolean = false): PricingResult {
  let basePrice: number;

  if (options.type === 'image') {
    basePrice = calculateImagePricing(options.count || 1);
  } else {
    // Content-based pricing - use word count or file size, whichever is higher
    const wordPrice = options.wordCount ? calculateWordPricing(options.wordCount) : 0;
    const sizePrice = options.fileSize ? calculateSizePricing(options.fileSize) : 0;
    basePrice = Math.max(wordPrice, sizePrice);
  }

  // Apply 40% discount if no errors found
  const discountPercentage = hasNoErrors ? 40 : 0;
  const discountAmount = (basePrice * discountPercentage) / 100;
  const finalPrice = basePrice - discountAmount;

  // Revenue share: 50/50 split based on ORIGINAL price (before discount)
  // Platform absorbs the discount cost
  const platformShare = (basePrice / 2) - discountAmount; // Platform gets 50% minus discount
  const agentShare = basePrice / 2; // Agent always gets 50% of original price

  return {
    basePrice,
    discountAmount,
    finalPrice,
    discountPercentage,
    platformShare: Math.max(0, platformShare), // Ensure non-negative
    agentShare,
    hasNoErrorsDiscount: hasNoErrors,
  };
}

/**
 * Format price in INR
 */
export function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Get pricing breakdown for display
 */
export function getPricingBreakdown(result: PricingResult): {
  label: string;
  value: string;
  highlight?: boolean;
}[] {
  return [
    {
      label: 'Base Price',
      value: formatPrice(result.basePrice),
    },
    ...(result.hasNoErrorsDiscount
      ? [
          {
            label: 'No Errors Discount (40%)',
            value: `-${formatPrice(result.discountAmount)}`,
            highlight: true,
          },
        ]
      : []),
    {
      label: 'Final Price',
      value: formatPrice(result.finalPrice),
      highlight: true,
    },
    {
      label: 'Agent Share (50%)',
      value: formatPrice(result.agentShare),
    },
    {
      label: 'Platform Share',
      value: formatPrice(result.platformShare),
    },
  ];
}

