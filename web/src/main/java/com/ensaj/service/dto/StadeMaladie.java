package com.ensaj.service.dto;

import com.ensaj.domain.ImageStade;
import com.ensaj.domain.Maladie;
import com.ensaj.domain.Stade;

public class StadeMaladie {

    Maladie maladie;
    Stade stade;

    public Maladie getMaladie() {
        return maladie;
    }

    public StadeMaladie() {
        super();
    }

    public StadeMaladie(Maladie maladie, Stade stade) {
        this.maladie = maladie;
        this.stade = stade;
    }

    public void setMaladie(Maladie maladie) {
        this.maladie = maladie;
    }

    public Stade getStade() {
        return stade;
    }

    public void setStade(Stade stade) {
        this.stade = stade;
    }
}
