# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
yarn install

# Development server with TinaCMS
yarn dev

# Production build
yarn build

# Start production server
yarn start

# Lint code
yarn lint

# Type check (no dedicated script, use directly)
npx tsc --noEmit
```

## Architecture Overview

This is a Next.js 12 marketing website for LangoMango, a language learning platform. The codebase uses TypeScript with strict mode enabled and follows a component-based architecture.

### Key Technologies
- **Next.js 12.1.0** with React 17
- **TypeScript** with strict mode
- **Styled Components** for CSS-in-JS styling
- **TinaCMS** for content management
- **next-i18next** for internationalization (EN/ES)
- **Formik** and **React Hook Form** for form handling
- **SendGrid** for transactional emails
- **Mailchimp** for newsletter subscriptions

### Project Structure
```
├── components/      # Reusable UI components (atomic design)
├── contexts/        # React contexts (VisitorContext, NewsletterContext)
├── hooks/          # Custom React hooks
├── pages/          # Next.js pages with file-based routing
├── posts/          # MDX blog posts with frontmatter
├── public/         
│   └── locales/    # Translation files (en/es)
├── services/       # API service layers
├── utils/          # Utility functions and helpers
└── views/          # Page-specific component compositions
```

### Important Patterns

1. **Styled Components Convention**: All styled components are defined at the bottom of component files and prefixed with `Styled*`
   ```typescript
   const StyledContainer = styled.div`...`
   ```

2. **Media Queries**: Use the `media` utility from `utils/media` for responsive design:
   ```typescript
   import { media } from 'utils/media';
   ${media('<=tablet')`...`}
   ```

3. **Internationalization**: All user-facing text should use translation keys:
   ```typescript
   const { t } = useTranslation('common');
   ```

4. **Color Theming**: Use theme colors from `ColorModeContext`:
   ```typescript
   color: ${p => p.theme.text};
   background: ${p => p.theme.background};
   ```

5. **Environment Variables**: Access through typed `env.ts` files:
   ```typescript
   import { env } from 'env.local'; // or env.production
   ```

### API Integration Points

- **SendGrid**: Email sending via `/api/contact` endpoint
- **Mailchimp**: Newsletter subscriptions handled in `NewsletterContext`
- **Analytics**: Multiple trackers (Vercel, ContentSquare, GTM, Reddit Pixel, MS Clarity)

### Content Management

- Blog posts in `/posts/*.mdx` with frontmatter metadata
- TinaCMS integration for visual editing (access via `/admin`)
- Logout from editing mode via `/admin/logout`

### Performance Considerations

- Image optimization with Next.js Image component
- Bundle analysis available with `ANALYZE=true yarn build`
- SWC minification enabled
- Lazy loading for heavy components (Swiper, etc.)

### Testing

**Note**: No testing framework is currently configured. When implementing tests, consider adding Jest or Vitest with React Testing Library.

### Common Tasks

When implementing new features:
1. Check existing components in `/components` before creating new ones
2. Follow the established styled-components pattern
3. Add translations to `/public/locales/[lang]/common.json`
4. Use TypeScript strict mode - no `any` types
5. Ensure mobile responsiveness using the media utility
6. Run `yarn lint` before committing
7. Run `npx tsc --noEmit` to check for TypeScript errors

### Deployment

The site is configured for Vercel deployment. Required environment variables:
- `SENDGRID_API_KEY` - SendGrid API key for email sending
- `NEXT_PUBLIC_ORGANIZATION_NAME` - (Optional) Tina Cloud organization
- `NEXT_PUBLIC_TINA_CLIENT_ID` - (Optional) Tina Cloud client ID
```

### Code Modification Workflow

- Every time you think you have finished modifying code, you will have to run `yarn dev`, and check that the output is clean, and that there are no errors. If you find errors you have introduced, fix them