export interface ISameStoreSales {
    key: string;
    description?: string;
    retail?: string;
    formato?: string;
    total_apertura?: number;
    total_apertura_pa?: number;
    total_apertura_var?: number;
    total_retail_crecimiento?: number;
    total_sss?: number;
    total_sss_pa?: number;
    total_sss_var?: number;
    total_sss_crecimiento?: number;
    total_sum_so?: number;
    total_sum_so_pa?: number;
    total_sum_so_var?: number;
    level?: number;
    expand?: boolean;
    children?: ISameStoreSales[];
    parent?: ISameStoreSales;
  }