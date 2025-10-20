import { prisma } from '@/lib/prisma';

export async function getPublicSiteConfig() {
  const config = await prisma.siteConfig.findFirst();
  if (!config) {
    throw new Error('SiteConfig não encontrado. Execute as seeds.');
  }
  return {
    branding: config.branding as Record<string, unknown>,
    bankAccounts: config.bankAccounts as Array<Record<string, string>>,
    currencyPrimary: config.currencyPrimary,
    currencySecondary: config.currencySecondary,
    exchangeRate: config.exchangeRate,
    minWithdrawal: config.minWithdrawal,
    termsUrl: config.termsUrl,
    privacyUrl: config.privacyUrl
  };
}
