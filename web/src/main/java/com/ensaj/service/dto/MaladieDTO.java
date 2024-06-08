package com.ensaj.service.dto;

import com.ensaj.domain.Maladie;
import com.ensaj.domain.Stade;
import java.util.List;

public class MaladieDTO {

    Maladie maladie;

    public MaladieDTO(Maladie maladie) {
        this.maladie = maladie;
    }

    public MaladieDTO() {
        super();
    }

    public Maladie getMaladie() {
        return maladie;
    }

    public void setMaladie(Maladie maladie) {
        this.maladie = maladie;
    }
}
