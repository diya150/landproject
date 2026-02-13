/**
 * Industry Images Mapping
 * Maps company names/IDs to their corresponding image files
 */

export interface IndustryImageMap {
  [industryId: string]: {
    filename: string;
    imagePath: string;
  };
}

export const industryImagesMap: IndustryImageMap = {
  'IND-011': {
    filename: 'bhilai steel plant block.png',
    imagePath: '/industry-images/bhilai%20steel%20plant%20block.png'
  },
  'IND-012': {
    filename: 'bansal metallics.png',
    imagePath: '/industry-images/bansal%20metallics.png'
  },
  'IND-013': {
    filename: 'barabaspur.industry.png',
    imagePath: '/industry-images/barabaspur.industry.png'
  },
  'IND-014': {
    filename: 'beekay engineering corporation.png',
    imagePath: '/industry-images/beekay%20engineering%20corporation.png'
  },
  'IND-015': {
    filename: 'bigmint (steelmint).png',
    imagePath: '/industry-images/bigmint%20%28steelmint%29.png'
  },
  'IND-016': {
    filename: 'kesda.industry.png',
    imagePath: '/industry-images/kesda.industry.png'
  },
  'IND-017': {
    filename: 'mahamaya sponge pvt ltd.png',
    imagePath: '/industry-images/mahamaya%20sponge%20pvt%20ltd.png'
  },
  'IND-018': {
    filename: 'nakoda tmt.png',
    imagePath: '/industry-images/nakoda%20tmt.png'
  },
  'IND-019': {
    filename: 'parasiya.industry.png',
    imagePath: '/industry-images/parasiya.industry.png'
  },
  'IND-020': {
    filename: 'plasticpark.industry.png',
    imagePath: '/industry-images/plasticpark.industry.png'
  },
  'IND-021': {
    filename: 'railpark.industry.png',
    imagePath: '/industry-images/railpark.industry.png'
  },
  'IND-022': {
    filename: 'rikhi.industry.png',
    imagePath: '/industry-images/rikhi.industry.png'
  },
  'IND-023': {
    filename: 'sarda energy and minerals ltd.png',
    imagePath: '/industry-images/sarda%20energy%20and%20minerals%20ltd.png'
  },
  'IND-024': {
    filename: 'sarthak metals ltd.png',
    imagePath: '/industry-images/sarthak%20metals%20ltd.png'
  },
  'IND-025': {
    filename: 'textilepark.industry.png',
    imagePath: '/industry-images/textilepark.industry.png'
  },
  'IND-026': {
    filename: 'tilda.industry.png',
    imagePath: '/industry-images/tilda.industry.png'
  },
  'IND-027': {
    filename: 'ulakiya.industry.png',
    imagePath: '/industry-images/ulakiya.industry.png'
  },
  'IND-028': {
    filename: 'balod.bharda.industry.png',
    imagePath: '/industry-images/balod.bharda.industry.png'
  }
};

/**
 * Get image path for an industry
 */
export const getIndustryImagePath = (industryId: string): string | null => {
  return industryImagesMap[industryId]?.imagePath || null;
};

/**
 * Get industry image data by ID
 */
export const getIndustryImageData = (industryId: string) => {
  return industryImagesMap[industryId] || null;
};
