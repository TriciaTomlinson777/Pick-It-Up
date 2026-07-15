# Pick It Up Seattle

A community movement making it easy and fun to leave Seattle better than we found it.

## About

Pick It Up Seattle is a web platform that connects community members who want to participate in cleanup events across Seattle. Our mission is to make it simple and enjoyable for volunteers to help keep our city clean and beautiful.

## Features

- 🌳 **Event Calendar** - Discover and sign up for cleanup events across Seattle neighborhoods
- 🤝 **Volunteer Management** - Easy registration and team coordination
- 📊 **Impact Tracking** - See the real difference the community is making
- 🎁 **Shop** - Support our mission through merchandise sales
- 💚 **Donations** - Direct support for our cleanup efforts
- 📚 **Resources** - Community guides and sustainability tips
- 📝 **Blog** - Updates and stories from the field
- 📞 **Contact & Community** - Connect with the movement

## Tech Stack

- **Frontend Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Node Version**: 16+

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TriciaTomlinson777/Pick-It-Up.git
cd Pick-It-Up
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### File Structure

```
Pick-It-Up/
├── app/                          # Next.js App Router
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── events/                  # Events page
│   ├── about/                   # About page
│   ├── blog/                    # Blog page
│   ├── shop/                    # Shop page
│   ├── contact/                 # Contact page
│   ├── volunteer/               # Volunteer registration
│   ├── donate/                  # Donations page
│   ├── community-resources/     # Resources page
│   ├── privacy/                 # Privacy policy
│   └── terms/                   # Terms of service
├── components/                   # Reusable components
│   ├── Header.jsx              # Navigation header
│   └── Footer.jsx              # Footer with links
├── public/                       # Static files
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── next.config.js               # Next.js configuration
└── tsconfig.json                # TypeScript configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Colors

The site uses custom Seattle-themed colors defined in `tailwind.config.js`:
- `seattle-green`: `#2d5016`
- `seattle-blue`: `#0066cc`
- `seattle-accent`: `#00a651`

Modify these values to match your brand.

### Content

All page content is hardcoded in the page components. To add dynamic content:
1. Set up a content management system (CMS) or database
2. Create API routes in `/app/api`
3. Fetch content in the page components

### Images

To add real images:
1. Place images in `/public` directory
2. Use Next.js `Image` component for optimization
3. Update the `next.config.js` for remote images

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure settings
5. Click Deploy

### Manual Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file for local development:

```
NEXT_PUBLIC_APP_NAME=Pick It Up Seattle
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Contributing

We welcome contributions! Here's how to help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Event registration backend
- [ ] Photo gallery from past events
- [ ] Leaderboard for top volunteers
- [ ] Mobile app
- [ ] Real-time event updates
- [ ] Integration with payment processing
- [ ] Admin dashboard
- [ ] Event analytics

## Support

For questions or support:
- Email: hello@pickitupseattle.org
- Phone: (206) 555-1234
- Website: [pickitupseattle.org](https://pickitupseattle.org)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Seattle community members and volunteers
- Local environmental organizations
- All supporters of this movement

---

**Made with 💚 for Seattle**
