// Menu
export interface Menu {
  path?: string;
  title?: string;
  type?: string;
  megaMenu?: boolean;
  megaMenuType?: string; // small, medium, large
  image?: string;
  children?: Menu[];
}

export const MENUITEMS: Menu[] = [
  {
    title: "home",
    type: "sub"
  },
  {
    title: "Privacy Policy",
    path: "/pages/terms",
    megaMenu: true,
    type: "sub"
  },
  {
    title: "about",
    path: "/pages/about-us",
    megaMenu: true,
    type: "sub"
  },
  {
    title: "how it works",
    megaMenu: true,
    megaMenuType: "medium",
    children: [
      {
        path: "/home/left-sidebar/product/1",
        title: "left-sidebar",
        image: "assets/images/feature/product-page(left-sidebar).jpg",
        type: "link"
      },
      {
        path: "/home/right-sidebar/product/1",
        title: "right-sidebar",
        image: "assets/images/feature/product-page(right-sidebar).jpg",
        type: "link"
      },
      {
        path: "/home/no-sidebar/product/1",
        title: "no-sidebar",
        image: "assets/images/feature/product-page(no-sidebar).jpg",
        type: "link"
      },
      {
        path: "/home/col-left/product/1",
        title: "3-col-thumbnail-left",
        image: "assets/images/feature/product-page(3-col-left).jpg",
        type: "link"
      },
      {
        path: "/home/col-right/product/1",
        title: "3-col-thumbnail-right",
        image: "assets/images/feature/product-page(3-col-right).jpg",
        type: "link"
      },
      {
        path: "/home/column/product/1",
        title: "thumbnail-below",
        image: "assets/images/feature/product-page(3-column).jpg",
        type: "link"
      },
      {
        path: "/home/accordian/product/1",
        title: "accordian-details",
        image: "assets/images/feature/product-page(accordian).jpg",
        type: "link"
      },
      {
        path: "/home/left-image/product/1",
        title: "thumbnail-left",
        image: "assets/images/feature/product-page(left-image).jpg",
        type: "link"
      },
      {
        path: "/home/right-image/product/1",
        title: "thumbnail-right",
        image: "assets/images/feature/product-page(right-image).jpg",
        type: "link"
      },
      {
        path: "/home/vertical/product/1",
        title: "vertical-tab",
        image: "assets/images/feature/product-page(vertical-tab).jpg",
        type: "link"
      }
    ]
  }
];
