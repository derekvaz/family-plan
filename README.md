# Family Planner

A modern, accessible family scheduling and chore management app built with React. Helps families coordinate activities, assign chores, and stay organized together.

![Family Planner](https://img.shields.io/badge/React-18+-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-purple)

## Features

### 📅 Calendar Views
- **Weekly view** (desktop) - See the full week at a glance
- **Daily view** (mobile) - Focus on one day with quick week navigation
- **Month picker** - Jump to any date with swipe gesture support
- **Current time indicator** - Red line shows the current time on today's view

### ✅ Activities & Chores
- **Color-coded events** - Each family member has a unique accessible color
- **Gradient backgrounds** - Multi-person events display as beautiful gradients
- **Chore tracking** - Mark chores complete with visual feedback
- **Recurring events** - Weekly, bi-weekly, or monthly recurrence options
- **All-day events** - Support for events without specific times

### 👨‍👩‍👧‍👦 Family Management
- **Add/edit/remove family members** - Full CRUD for family profiles
- **Customizable colors** - 8 accessible color options per member
- **Smart filtering** - View all events or filter by family member
- **Cascading deletes** - Removing a member cleans up their solo events

### 🎯 User Experience
- **Click-to-create** - Click any time slot to create an event there
- **Natural language hints** - Autocomplete for common activities and chores
- **Touch gestures** - Swipe to navigate days/weeks
- **Responsive design** - Optimized for mobile, tablet, and desktop
- **Persistent storage** - Data saves to localStorage automatically

### ♿ Accessibility
- **WCAG 2.1 AA compliant** - Accessible color contrast ratios
- **Keyboard navigation** - Full keyboard support for all interactions
- **Screen reader friendly** - Proper ARIA labels and semantic HTML
- **Focus indicators** - Clear visual focus states

## Tech Stack

- **React 18** - UI framework with hooks
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **localStorage** - Client-side persistence

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/derekvaz/family-plan.git
   cd family-plan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Usage

### Creating Events

1. **Click the + button** (FAB) in the bottom-right corner, or
2. **Click directly on the calendar** at your desired time slot

### Managing Family Members

1. Click the **gear icon** (⚙️) in the header
2. Add, edit, or remove family members
3. Customize colors for each person

### Navigation

- **Desktop**: Use arrow buttons or swipe to navigate weeks
- **Mobile**: 
  - Tap days in the header to switch days
  - Swipe the header to change weeks
  - Swipe the calendar body to move between days

### Filtering

Use the tabs below the header to filter events by family member or view all.

## Project Structure

```
family-plan/
├── src/
│   └── App.jsx          # Main application component
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Customization

### Adding More Colors

Edit the `COLOR_OPTIONS` array in the source to add more color choices:

```javascript
const COLOR_OPTIONS = [
  { color: '#D97706', lightColor: '#FEF3C7', textColor: '#92400E', name: 'Amber' },
  // Add more colors here...
];
```

### Changing Default Family Members

Edit the `DEFAULT_FAMILY_MEMBERS` array to customize the initial family setup.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by iOS Calendar and Google Calendar UX patterns

## Roadmap

- [ ] Cloud sync with user accounts
- [ ] Push notifications for reminders
- [ ] Drag-and-drop event rescheduling
- [ ] Event templates
- [ ] Shared family calendars across devices
- [ ] Export to iCal/Google Calendar

---

Made with ❤️ for families everywhere
