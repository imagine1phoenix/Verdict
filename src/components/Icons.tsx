import React from 'react';

// Exact glyph-neue slugs mapped from the Icons8 API
const iconMap: Record<string, string> = {
  "Activity": "activity",
  "AlertTriangle": "triangle-stroked",
  "Archive": "archive",
  "ArrowRight": "right",
  "AtSign": "email",
  "BarChart3": "bar-chart",
  "Bell": "bell--v2",
  "BookOpen": "open-book",
  "Bookmark": "bookmark-ribbon",
  "Bot": "bot",
  "Brain": "brain",
  "Building": "building",
  "Calendar": "calendar",
  "CalendarDays": "calendar",
  "Check": "checked-checkbox",
  "CheckCircle": "100-percents",
  "CheckCircle2": "us-dollar-circled",
  "CheckSquare": "unchecked-checkbox",
  "ChevronDown": "chevron-down",
  "ChevronLeft": "chevron-left",
  "ChevronRight": "chevron-right",
  "Circle": "100-percents",
  "ClipboardList": "clipboard",
  "Clock": "clock",
  "Command": "source-code",
  "CreditCard": "credit-card-front",
  "Database": "database",
  "DollarSign": "us-dollar-circled",
  "Download": "download",
  "Edit": "create-new",
  "Edit2": "increase-font",
  "ExternalLink": "external-link",
  "Eye": "visible",
  "EyeOff": "switch-off",
  "FileCheck2": "check-all",
  "FileSearch": "google-web-search",
  "FileText": "document",
  "FileWarning": "file",
  "Filter": "filter",
  "FolderOpen": "opened-folder",
  "Gavel": "law",
  "Globe": "globe--v2",
  "GraduationCap": "graduation-cap",
  "Handshake": "handshake",
  "Heart": "like",
  "History": "activity-history",
  "Home": "home",
  "Keyboard": "keyboard",
  "Layers": "layers",
  "Link2": "link",
  "Loader2": "iphone-spinner",
  "Lock": "lock",
  "LogOut": "exit",
  "Mail": "mail",
  "MapPin": "map-pin",
  "Maximize2": "expand",
  "Menu": "menu",
  "MessageSquare": "unchecked-checkbox",
  "Mic": "microphone",
  "Minimize2": "minimize-window",
  "Monitor": "monitor",
  "Moon": "crescent-moon",
  "Pin": "pin",
  "PlayCircle": "play",
  "Plus": "plus",
  "RefreshCw": "refresh",
  "Save": "save",
  "Scale": "scale",
  "Search": "search",
  "Send": "send",
  "Settings": "settings",
  "Shield": "user-shield",
  "ShieldAlert": "warning-shield",
  "Smartphone": "smartphone",
  "Sparkles": "sparkling--v2",
  "Star": "star",
  "Sun": "sun",
  "Tag": "tag",
  "Target": "define-location",
  "Timer": "timer",
  "Trash2": "trash",
  "TrendingUp": "up",
  "Trophy": "trophy",
  "Unlock": "unlock-2",
  "Upload": "upload",
  "UploadCloud": "upload-to-cloud--v2",
  "User": "user",
  "UserPlus": "plus",
  "Users": "group",
  "Video": "video",
  "X": "x",
  "XCircle": "xcircle",
  "Zap": "zap"
};

type LucideProps = {
  size?: number | string;
  className?: string;
  color?: string;
  fill?: string;
  strokeWidth?: number | string;
  onClick?: () => void;
  style?: React.CSSProperties;
  [key: string]: any;
};

const createIcon = (name: string) => {
  const IconComponent = ({ size = 24, className = '', color = 'currentColor', style, ...props }: LucideProps) => {
    const slug = iconMap[name] || name.toLowerCase();
    const url = `https://img.icons8.com/glyph-neue/256/000000/${slug}.png`;
    
    // Use mask-image to color the PNG perfectly using currentColor or the forced color prop
    const combinedStyle: React.CSSProperties = {
      display: 'inline-block',
      width: size,
      height: size,
      backgroundColor: color,
      WebkitMaskImage: `url('${url}')`,
      WebkitMaskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskImage: `url('${url}')`,
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      maskPosition: 'center',
      ...style,
    };

    return (
      <span
        className={`iconify-wrapper ${className}`}
        style={combinedStyle}
        onClick={props.onClick}
        aria-hidden="true"
        role="img"
        {...props}
      />
    );
  };
  IconComponent.displayName = name;
  return IconComponent;
};

// All 92 exports
export const Activity = createIcon('Activity');
export const AlertTriangle = createIcon('AlertTriangle');
export const Archive = createIcon('Archive');
export const ArrowRight = createIcon('ArrowRight');
export const AtSign = createIcon('AtSign');
export const BarChart3 = createIcon('BarChart3');
export const Bell = createIcon('Bell');
export const BookOpen = createIcon('BookOpen');
export const Bookmark = createIcon('Bookmark');
export const Bot = createIcon('Bot');
export const Brain = createIcon('Brain');
export const Building = createIcon('Building');
export const Calendar = createIcon('Calendar');
export const CalendarDays = createIcon('CalendarDays');
export const Check = createIcon('Check');
export const CheckCircle = createIcon('CheckCircle');
export const CheckCircle2 = createIcon('CheckCircle2');
export const CheckSquare = createIcon('CheckSquare');
export const ChevronDown = createIcon('ChevronDown');
export const ChevronLeft = createIcon('ChevronLeft');
export const ChevronRight = createIcon('ChevronRight');
export const Circle = createIcon('Circle');
export const ClipboardList = createIcon('ClipboardList');
export const Clock = createIcon('Clock');
export const Command = createIcon('Command');
export const CreditCard = createIcon('CreditCard');
export const Database = createIcon('Database');
export const DollarSign = createIcon('DollarSign');
export const Download = createIcon('Download');
export const Edit = createIcon('Edit');
export const Edit2 = createIcon('Edit2');
export const ExternalLink = createIcon('ExternalLink');
export const Eye = createIcon('Eye');
export const EyeOff = createIcon('EyeOff');
export const FileCheck2 = createIcon('FileCheck2');
export const FileSearch = createIcon('FileSearch');
export const FileText = createIcon('FileText');
export const FileWarning = createIcon('FileWarning');
export const Filter = createIcon('Filter');
export const FolderOpen = createIcon('FolderOpen');
export const Gavel = createIcon('Gavel');
export const Globe = createIcon('Globe');
export const GraduationCap = createIcon('GraduationCap');
export const Handshake = createIcon('Handshake');
export const Heart = createIcon('Heart');
export const History = createIcon('History');
export const Home = createIcon('Home');
export const Keyboard = createIcon('Keyboard');
export const Layers = createIcon('Layers');
export const Link2 = createIcon('Link2');
export const Loader2 = createIcon('Loader2');
export const Lock = createIcon('Lock');
export const LogOut = createIcon('LogOut');
export const Mail = createIcon('Mail');
export const MapPin = createIcon('MapPin');
export const Maximize2 = createIcon('Maximize2');
export const Menu = createIcon('Menu');
export const MessageSquare = createIcon('MessageSquare');
export const Mic = createIcon('Mic');
export const Minimize2 = createIcon('Minimize2');
export const Monitor = createIcon('Monitor');
export const Moon = createIcon('Moon');
export const Pin = createIcon('Pin');
export const PlayCircle = createIcon('PlayCircle');
export const Plus = createIcon('Plus');
export const RefreshCw = createIcon('RefreshCw');
export const Save = createIcon('Save');
export const Scale = createIcon('Scale');
export const Search = createIcon('Search');
export const Send = createIcon('Send');
export const Settings = createIcon('Settings');
export const Shield = createIcon('Shield');
export const ShieldAlert = createIcon('ShieldAlert');
export const Smartphone = createIcon('Smartphone');
export const Sparkles = createIcon('Sparkles');
export const Star = createIcon('Star');
export const Sun = createIcon('Sun');
export const Tag = createIcon('Tag');
export const Target = createIcon('Target');
export const Timer = createIcon('Timer');
export const Trash2 = createIcon('Trash2');
export const TrendingUp = createIcon('TrendingUp');
export const Trophy = createIcon('Trophy');
export const Unlock = createIcon('Unlock');
export const Upload = createIcon('Upload');
export const UploadCloud = createIcon('UploadCloud');
export const User = createIcon('User');
export const UserPlus = createIcon('UserPlus');
export const Users = createIcon('Users');
export const Video = createIcon('Video');
export const X = createIcon('X');
export const XCircle = createIcon('XCircle');
export const Zap = createIcon('Zap');
